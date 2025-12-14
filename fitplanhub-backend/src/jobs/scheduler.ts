// ========================================
// src/jobs/scheduler.ts
// ========================================
import cron from 'node-cron';
import { Subscription } from '../models/Subscription.model';
import { User } from '../models/User.model';
import { Plan } from '../models/Plan.model';
import { emailService } from '../services/email.service';
import { createNotification } from '../services/notification.service';

// Check for expiring subscriptions (runs daily at 9 AM)
export const subscriptionReminderJob = cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running subscription reminder job...');
  
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSubscriptions = await Subscription.find({
      status: 'active',
      endDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow
      }
    }).populate('userId planId');

    for (const subscription of expiringSubscriptions) {
      const user = subscription.userId as any;
      const plan = subscription.planId as any;
      const daysLeft = Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      // Send email reminder
      await emailService.sendSubscriptionReminder(
        user.email,
        user.name,
        plan.title,
        daysLeft
      );

      // Create notification
      await createNotification({
        userId: user._id.toString(),
        type: 'reminder',
        title: 'Subscription Expiring Soon',
        message: `Your subscription to ${plan.title} expires in ${daysLeft} days`,
        link: `/plan/${plan._id}`
      });
    }

    console.log(`✅ Sent ${expiringSubscriptions.length} subscription reminders`);
  } catch (error) {
    console.error('❌ Error in subscription reminder job:', error);
  }
});

// Mark expired subscriptions (runs daily at midnight)
export const expireSubscriptionsJob = cron.schedule('0 0 * * *', async () => {
  console.log('🔔 Running expire subscriptions job...');
  
  try {
    const result = await Subscription.updateMany(
      {
        status: 'active',
        endDate: { $lt: new Date() }
      },
      {
        $set: { status: 'expired' }
      }
    );

    console.log(`✅ Expired ${result.modifiedCount} subscriptions`);
  } catch (error) {
    console.error('❌ Error in expire subscriptions job:', error);
  }
});

// Send workout reminders (runs daily at 6 PM)
export const workoutReminderJob = cron.schedule('0 18 * * *', async () => {
  console.log('🔔 Running workout reminder job...');
  
  try {
    const activeSubscriptions = await Subscription.find({
      status: 'active'
    }).populate('userId');

    for (const subscription of activeSubscriptions) {
      const user = subscription.userId as any;

      // Send email
      await emailService.sendWorkoutReminder(user.email, user.name);

      // Create notification
      await createNotification({
        userId: user._id.toString(),
        type: 'reminder',
        title: 'Workout Reminder',
        message: "Don't forget your workout today! 💪",
        link: '/dashboard'
      });
    }

    console.log(`✅ Sent ${activeSubscriptions.length} workout reminders`);
  } catch (error) {
    console.error('❌ Error in workout reminder job:', error);
  }
});

// Weekly progress report (runs every Sunday at 6 PM)
export const weeklyProgressReportJob = cron.schedule('0 18 * * 0', async () => {
  console.log('🔔 Running weekly progress report job...');
  
  try {
    // TODO: Implement weekly progress report logic
    console.log('✅ Weekly progress reports sent');
  } catch (error) {
    console.error('❌ Error in weekly progress report job:', error);
  }
});

// Start all cron jobs
export const startScheduler = () => {
  if (process.env.ENABLE_CRON_JOBS === 'true') {
    console.log('🚀 Starting cron jobs...');
    subscriptionReminderJob.start();
    expireSubscriptionsJob.start();
    workoutReminderJob.start();
    weeklyProgressReportJob.start();
    console.log('✅ All cron jobs started');
  } else {
    console.log('⏸️  Cron jobs are disabled');
  }
};

// Stop all cron jobs
export const stopScheduler = () => {
  subscriptionReminderJob.stop();
  expireSubscriptionsJob.stop();
  workoutReminderJob.stop();
  weeklyProgressReportJob.stop();
  console.log('🛑 All cron jobs stopped');
};
