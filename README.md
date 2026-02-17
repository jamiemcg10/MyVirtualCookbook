# **MyVirtualCookbook**

## An app for collecting and organizing recipe bookmarks online.

[https://my-virtual-cookbook.vercel.app/](https://my-virtual-cookbook.vercel.app/)

### User Accounts

New users can create an account. You can register by linking to your Google account. Alternatively, you can use **demo mode** to see the app's functionality using a temporary, anonymous account. The account will contain some starter data and will be deleted after 30 days of inactivity. Once you log out of demo mode, logging in again will create a different demo account.
<br>

### Using the cookbook

Once you create an account, you can add recipes and chapters to your cookbook using the _Add Chapter_ and _Add Recipe_ buttons at the top of the screen. Recipes can be added to an existing chapter or to a new chapter, but each recipe must belong to a chapter.

Chapters can be expanded or collapsed by clicking them. Clicking a chapter's trash icon will delete that chapter. Clicking the edit icon by the chapter name will let you edit the name of the chapter. You can drag and drop chapters to reorder them.

Each recipe has a menu with options to edit or delete that recipe. The name and the link for the recipe can be edited. You can drag and drop recipes to re-order them within the chapter and also to move them into other chapters.
<br>

### Viewing recipes and recipe notes

Recipes can be opened by clicking on their titles. When a recipe is expanded, a box is shown where you can view or edit notes for that recipe.

<br>
<hr>
<br>
This is a React and Next.js app deployed with Vercel using Firebase Authentication and Firestore Database.

<br>

To run locally, you will need a private key from the project owner. Use these values to update `TEMPLATE.env`, then rename the file to `.env`.

Alternatively, you can create your own Firebase project and connect the app to that. To do this, you will need to

1. Create a new Firebase project with Authentication and a Firestore Database enabled
2. Enable Google and Anonymous Authentication providers
3. Create a `users` collection in the Firestore Database
4. Generate and replace the `firebaseConfig` variable in `lib/utils/firebase/firebase.ts`

With this, you can then run `npm install` to install the required packages and then `npm run dev` to start the dev server.
