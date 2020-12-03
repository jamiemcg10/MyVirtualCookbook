# **MyVirtualCookbook**

## An app for collecting and organizing recipe bookmarks online. 

<br>

### User Accounts  
New users must first create an account. You can register using an email address and password or by linking to your Google or Facebook account.

<br>  

### Using the Virtual Cookbook
Once an account has been created, you can add recipes and chapters to your cookbook using the *Add Recipe* and *Add Chapter* buttons at the bottom of the screen. Recipes can be added to an existing chapter or to a new chapter. Each recipe must belong to a chapter. Chapters can be opened or closed by clicking them. Recipes can be moved between chapters by dragging them from one chapter to another. Right-clicking a chapter or recipe brings up a menu with options to rename or delete that recipe or chapter.

<br>

### Viewing Recipes and Recipe Notes
Next to each recipe is an icon for notes. When this icon is clicked, a box will appear underneath the recipe where users can view or edit notes for that recipe. Changes to notes save automatically. Clicking the icon again will hide the notes box. Recipes can be opened by clicking on their titles. There are two types of recipe pages. 

- Recipes that are underlined will open in a new tab with a separate pop-up window with the notes for that recipe. 
- Recipes that are not underlined will open in a new tab and will have the notes in a pane on the side of the page.

Notes can only be edited in one place at a time, so if a recipe is open, you can't edit notes in the table of contents.    
  
  
<br>    
<br>  
  
***
## *To run this on a local machine*
1. Clone the code and install the app (you must have npm installed).
2. Remame the TEMPLATE.env file in the project directory to .env and update the variables for your machine
    - Enter a value for JWT_SECRET and SESSION_SECRET 
    - If you use a port other than 5000 for your server, SITE_ADDRESS and PORT will need to be updated
    - If you use a port other than 27017 for MongoDB, DB_ADDRESS will need to be updated
    - If you do not supply a key and secret for Google and Facebook logins, that functionality will not work. However, you will still be able to create an account using an email address and password
3. Edit the .env file in /client if your server is on a port other than 5000
4. Run the server and go to your localhost at the appropriate port
