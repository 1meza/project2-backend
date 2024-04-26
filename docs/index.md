# Group 8 - Project documentation:
### Description:
Our footwear ecommerce website includes a wide range of shoes you are able to shop
and add to your collection. We offer a secure and reliable shopping experience for all of
our users. As well as different types of shipment speeds and a login page for those who
may want to create an account to shop the perfect pair of shoes for all your outfits.
## Product Architecture:
### Front end:
Our website will be organized into six core modules (HTML) files that make up the front
end of our application. These are the following:
- home module
- shopping cart module
- checkout module
- login module
- account module
- shop module
### Backend:
We will also have a backend to our application which will be in charge of the logic of our
website and the connection to our server. Our main js files that will be in charge of
website functionality are:
- database.js
- Database_collection.js
- validation.js
- index.js
- users.js
Apart from the js files that will be in charge of the logic .ejs files are also present in our
backend in order to create the HTML for our front end, these are:
- Account made.ejs
- Errors.ejs
- Shopping_cart.ejs
- Login.ejs
- Cart.ejs
- createAccount.ejs
- checkout.ejs
### Website functionality and requirements:
- Have a variety of products for our users to choose from
- Give users the ability to log in and have their data saved for later
- Our website has to have the ability to connect to the cloud
- Mongodb and our website should communicate with each other and save user
information as well as their respective shopping items.
- Have a shopping cart where users can see their items “added to the shop”
- Give users the ability to buy our products by submitting their shipping method
and address
- Be able to have multiple users using our website at once.
Specific module requirements
### home module
- Have at least 25 interactive products which users can buy
- Have a consistent navigation bar which include a login, cart and shop buttons
shopping cart module
- Users should be able to add, delete and increase number of items in the cart
- Shippingcart should be able to save user information to the cloud
- Be able to go to checkout from shopping cart page
- Be consistent even if user is navigating throughout page
### checkout module
- Be able to link user and their items together
- Be able to communicate with mongoDB and save user information
login module / account module
- Be able to communicate with mongoDB and save user information
- Be able to authenticate users by checking their email and password
- Be able to keep users signed in until they log out.
- Keep track of what account the user is buying items from
### Non-Functional Requirements
Security and Privacy Requirements
- Highly sensitive data like usernames and passwords should not be able to be
accessed externally from the system.
Environmental Requirements
- The website should be able to run at any time of the day.
Performance Requirements
- System should have enough memory to store an unlimited amount of users
accounts, tellers accounts, and user information
- The system should be able to verify the user's ID and password in a timely
manner in order for the user to experience as little lag as possible while using the
website
- The system should be able to perform actions on any account in a timely manner
to ensure that they experience minimal delay and risk
