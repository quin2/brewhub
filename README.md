# brewhub

This was a small project that I made a little while ago to try and make a serverless ecommerce application. All backend inventory is handled in Airtable. Because brewhub is tailored to brewery beer orders and price list inquiries, there is no logic for payment, instead, everything is done using AWS SES mailers controlled by lambda. When a new order is placed, the order contents are transferred to lambda where they're compiled into an email and sent off. 

brewhub was intended to be an MVP for a startup that never took off, so it's a little rough around the edges. 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

