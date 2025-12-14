// Cron jobs setup
import cron from "node-cron";
import { Subscription } from "../models/Subscription.model";
import { User } from "../models/User.model";
import { Plan } from "../models/Plan.model";
import { emailService } from "../services/email.service";
import { createNotification } from "../services/notification.service";

// Daily subscription reminders - 9 AM
export const subscriptionReminderJob = cron.schedule("0 9 * * *", async () => {
  console.log("Running subscription reminders...");

  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSubscriptions = await Subscription.find({
      status: "active",
      endDate: {
        $gte: new Date(),
        $lte: threeDaysFromNow,
      },
    }).populate("userId planId");

    for (const subscription of expiringSubscriptions) {
      const user = subscription.userId as any;
      const plan = subscription.planId as any;
      const daysLeft = Math.ceil(
        (subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      await emailService.sendSubscriptionReminder(
        user.email,
        user.name,
        plan.title,
        daysLeft
      );

      await createNotification({
        userId: user._id.toString(),
        type: "reminder",
        title: "Subscription Expiring Soon",
        message: `Your subscription to ${plan.title} expires in ${daysLeft} days`,
        link: `/plan/${plan._id}`,
      });
    }

    console.log(`Sent ${expiringSubscriptions.length} reminders`);
  } catch (error) {
    console.error("Subscription job failed:", error);
  }
});

// Mark expired subs - midnight
export const expireSubscriptionsJob = cron.schedule("0 0 * * *", async () => {
  console.log("Running expire subscriptions...");

  try {
    const result = await Subscription.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
      },
      {
        $set: { status: "expired" },
      }
    );

    console.log(`Expired ${result.modifiedCount} subscriptions`);
  } catch (error) {
    console.error("Expire job failed:", error);
  }
});

// Weekly reports - Sunday 6 PM
export const weeklyProgressReportJob = cron.schedule("0 18 * * 0", async () => {
  console.log("Running weekly reports...");

  try {
    // TODO: add progress report logic
    console.log("Weekly reports done");
  } catch (error) {
    console.error("Weekly job failed:", error);
  }
});

// Start all jobs
export const startScheduler = () => {
  if (process.env.ENABLE_CRON_JOBS === "true") {
    console.log("Starting cron jobs");
    subscriptionReminderJob.start();
    expireSubscriptionsJob.start();
    weeklyProgressReportJob.start();
    console.log("All jobs started");
  } else {
    console.log("Cron jobs disabled");
  }
};

// Stop all jobs
export const stopScheduler = () => {
  subscriptionReminderJob.stop();
  expireSubscriptionsJob.stop();
  weeklyProgressReportJob.stop();
  console.log("All jobs stopped");
};
