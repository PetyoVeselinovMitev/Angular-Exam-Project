# Angular-Exam-Project
1. Brief Description
   - The BookNest library management app.
   - Users can: 
        See recently added books at the home page
        Browse catalog of books
        See details about a book of liking
        Create and login accounts
        Reserve books and return books.
    - Admin accounts:
        Admin accounts have the ability to register other admin accounts
        Create edit and delete books.
        Admins can also reserve and return books.
    - There are two predefined users 
       - user with 
            email: user@abv.bg
            password: user
       - admin with
            email: admin@abv.bg
            password: admin
2. Installation Instructions and structure
   - The main directory contains:
      - API folder - server
      - BookNest folder - front end
      - resourcese - initial db collections and example books for testing purpouses
  
   - MongoDb setup
     - install MongoDb community server https://www.mongodb.com/try/download/community
     - install MongoDb Compass GUI https://www.mongodb.com/try/download/compass
     - By default the connection address is localhost:27017 and the application is configured to use that address
     - in MongoDb Compass connect to localhost:27017 and create database with the name 'library'
     - in the library database add two collections - users and books
     - in both collections click add-data and select the 'Import JSON' option and import the coresponding files from the resources/initialDb 

   - Server installation
     - enter API directory and run command: npm install to install dependencies
     - to start the server run command: npm start
  
   - Front end installation
     - enter BookNest directory
     - run command: npm install -g @angular/cli to install angular cli
     - run command: npm install to install dependancies.
     - to start the application run command: ng serve
   
   - You can browse the app locally at http://localhost:4200/ by default after setting up MongoDb and installing the server and angular app.
     - if port 4200 is not available another port will be automaticly used. Refer to the console of the BookNest app to see running address. 