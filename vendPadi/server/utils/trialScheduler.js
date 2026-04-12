const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { 
  sendTrialExpiringReminderEmail, 
  sendTrialExpiredEmail,
  sendFirstOrderFollowUpEmail,
  sendFirstProductFollowUpEmail,
  sendTrialStartedEmail,
  sendAccountDeletionRequestedEmail,
  sendAccountDeletionWarningEmail,
  sendAccountPermanentlyDeletedEmail
} = require('../utils/email');

const TRIAL_REMINDER_DAYS = [2, 1];
const CHECK_INTERVAL = 60 * 60 * 1000;

const log = {
  info: (...args) => console.log(`[${new Date().toISOString()}] [TRIAL-SCHEDULER]`, ...args),
  error: (...args) => console.error(`[${new Date().toISOString()}] [TRIAL-SCHEDULER]`, ...args)
};

const sendTrialReminders = async () => {
  try {
    const now = new Date();
    
    const trialsExpiringSoon = await Vendor.find({
      "trial.active": true,
      "trial.endDate": { $exists: true }
    });

    let remindersSent = 0;

    for (const vendor of trialsExpiringSoon) {
      const endDate = new Date(vendor.trial.endDate);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      if (TRIAL_REMINDER_DAYS.includes(daysRemaining) && !vendor.trial.reminderSent) {
        await sendTrialExpiringReminderEmail(
          vendor.email,
          vendor.businessName,
          daysRemaining,
          vendor.trial.plan
        );
        
        vendor.trial.reminderSent = true;
        await vendor.save();
        remindersSent++;
        
        log.info(`Sent ${daysRemaining}-day reminder to ${vendor.email}`);
      }
    }

    if (remindersSent > 0) {
      log.info(`Sent ${remindersSent} trial reminders`);
    }
  } catch (error) {
    log.error('Error sending trial reminders:', error);
  }
};

const processExpiredTrials = async () => {
  try {
    const now = new Date();
    
    const expiredTrials = await Vendor.find({
      "trial.active": true,
      "trial.endDate": { $lt: now }
    });

    let expiredProcessed = 0;

    for (const vendor of expiredTrials) {
      vendor.trial.active = false;
      vendor.trial.plan = null;
      vendor.trial.reminderSent = false;
      await vendor.save();

      await sendTrialExpiredEmail(vendor.email, vendor.businessName);
      expiredProcessed++;
      
      log.info(`Processed expired trial for ${vendor.email}`);
    }

    if (expiredProcessed > 0) {
      log.info(`Processed ${expiredProcessed} expired trials`);
    }
  } catch (error) {
    log.error('Error processing expired trials:', error);
  }
};

const sendFirstOrderFollowUps = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentOrders = await Order.find({
      createdAt: { $gte: oneDayAgo },
      followUpSent: { $ne: true },
      status: { $in: ['confirmed', 'delivered'] }
    });

    let followUpsSent = 0;

    for (const order of recentOrders) {
      const vendor = await Vendor.findById(order.vendorId);
      if (!vendor || vendor.isAdmin) continue;

      const orderCount = await Order.countDocuments({ 
        vendorId: vendor._id, 
        status: { $in: ['confirmed', 'delivered'] } 
      });

      if (orderCount === 1) {
        await sendFirstOrderFollowUpEmail(
          vendor.email,
          vendor.businessName,
          orderCount,
          vendor.analytics?.totalRevenue || 0
        );
        
        order.followUpSent = true;
        await order.save();
        followUpsSent++;
        
        log.info(`Sent first order follow-up to ${vendor.email}`);
      }
    }

    if (followUpsSent > 0) {
      log.info(`Sent ${followUpsSent} first order follow-ups`);
    }
  } catch (error) {
    log.error('Error sending first order follow-ups:', error);
  }
};

const sendFirstProductFollowUps = async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const vendorsWithProducts = await Vendor.find({
      createdAt: { $lte: threeDaysAgo },
      isAdmin: { $ne: true },
      "followUp.productAdded": { $ne: true }
    });

    let followUpsSent = 0;

    for (const vendor of vendorsWithProducts) {
      const productCount = await Product.countDocuments({ vendorId: vendor._id });
      const orderCount = await Order.countDocuments({ 
        vendorId: vendor._id, 
        status: { $in: ['confirmed', 'delivered'] } 
      });

      if (productCount > 0 && orderCount === 0) {
        await sendFirstProductFollowUpEmail(vendor.email, vendor.businessName);
        
        vendor.followUp = vendor.followUp || {};
        vendor.followUp.productAdded = true;
        await vendor.save();
        followUpsSent++;
        
        log.info(`Sent first product follow-up to ${vendor.email}`);
      }
    }

    if (followUpsSent > 0) {
      log.info(`Sent ${followUpsSent} first product follow-ups`);
    }
  } catch (error) {
    log.error('Error sending first product follow-ups:', error);
  }
};

const processPendingDeletions = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const vendorsToDelete = await Vendor.find({
      deletionRequestedAt: { $lt: thirtyDaysAgo },
      deletedAt: null
    });

    let deletedCount = 0;

    for (const vendor of vendorsToDelete) {
      await Product.deleteMany({ vendorId: vendor._id });
      
      vendor.deletedAt = new Date();
      await vendor.save();
      
      deletedCount++;
      log.info(`Permanently deleted account: ${vendor._id}`);
    }

    if (deletedCount > 0) {
      log.info(`Processed ${deletedCount} permanent account deletions`);
    }
  } catch (error) {
    log.error('Error processing pending deletions:', error);
  }
};

const sendDeletionWarningEmails = async () => {
  try {
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sixDaysFromNow = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);
    
    const vendorsWithPendingDeletion = await Vendor.find({
      deletionRequestedAt: { $exists: true },
      deletedAt: null,
      isActive: false
    });

    for (const vendor of vendorsWithPendingDeletion) {
      const deletionDate = new Date(vendor.deletionRequestedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      if (deletionDate > sixDaysFromNow && deletionDate <= sevenDaysFromNow) {
        const daysRemaining = Math.ceil((deletionDate - Date.now()) / (1000 * 60 * 60 * 24));
        
        await sendAccountDeletionWarningEmail(
          vendor.email,
          vendor.businessName,
          daysRemaining
        );
        
        log.info(`Sent deletion warning email to ${vendor.email}`);
      }
    }
  } catch (error) {
    log.error('Error sending deletion warning emails:', error);
  }
};

let isRunning = false;

const runScheduler = async () => {
  if (isRunning) {
    log.info('Scheduler already running, skipping...');
    return;
  }

  isRunning = true;
  
  try {
    log.info('Running scheduled tasks...');
    
    await Promise.all([
      sendTrialReminders(),
      processExpiredTrials(),
      sendFirstOrderFollowUps(),
      sendFirstProductFollowUps(),
      processPendingDeletions(),
      sendDeletionWarningEmails()
    ]);
    
    log.info('Scheduled tasks completed');
  } catch (error) {
    log.error('Error running scheduler:', error);
  } finally {
    isRunning = false;
  }
};

const startScheduler = () => {
  log.info('Starting trial & follow-up scheduler...');
  
  runScheduler();
  
  setInterval(runScheduler, CHECK_INTERVAL);
  
  log.info(`Scheduler started. Will run every ${CHECK_INTERVAL / 60000} minutes.`);
};

const sendTrialStartEmail = async (vendor) => {
  if (vendor.trial?.active && vendor.trial?.endDate) {
    await sendTrialStartedEmail(
      vendor.email,
      vendor.businessName,
      vendor.trial.plan,
      vendor.trial.endDate
    );
    log.info(`Sent trial start email to ${vendor.email}`);
  }
};

module.exports = {
  startScheduler,
  sendTrialStartEmail,
  runScheduler
};
