const db = require("../db/connection");

const seedSubscriptions = async () => {
  try {
    // Define the subscription plans
    const subscriptions = [
      {
        name: "Basic Plan",
        description: "Access to basic features.",
        price: 10.99,
        duration: 30, // 30 days
      },
      {
        name: "Pro Plan",
        description: "Access to premium features.",
        price: 29.99,
        duration: 90, // 90 days
      },
      {
        name: "Enterprise Plan",
        description: "Access to all features and dedicated support.",
        price: 99.99,
        duration: 365, // 365 days
      },
    ];

    // Insert each subscription into the database
    for (const subscription of subscriptions) {
      const sql = `
        INSERT INTO subscriptions (name, description, price, duration)
        VALUES (?, ?, ?, ?)
      `;
      const values = [subscription.name, subscription.description, subscription.price, subscription.duration];
      await db.execute(sql, values);
    }

    console.log("Subscription plans seeded successfully!");
  } catch (error) {
    console.error("Error seeding subscription plans:", error);
  } finally {
    process.exit(); // Exit the script
  }
};

seedSubscriptions();
