"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStories.hide();
  $myStories.hide();
}
$body.on("click", "#nav-all", navAllStories);

function navAddNewStory(evt){
  console.debug("navAddNewStory", evt);
  hidePageComponents();
  $allStoriesList.show();
  $addStoryForm.show();
}
$navAddStory.on('click', navAddNewStory);

/** Show My Stories on clicking "my stories" */
function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $myStories.show();
  $favoriteStories.hide();
  }
  $body.on("click", "#nav-my-stories", navMyStories);

/** Show favorite stories on click on "favorites" */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoriteOnPage();
    $myStories.hide();
  }
  $body.on("click", "#nav-favorites", navFavoritesClick);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function navProfileClick(evt){
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
  $favoriteStories.hide();
  $myStories.hide();
  $profileName.text(`${currentUser.name}`);
  $profileUserName.text(`${currentUser.username}`);
  $profileAccountDate.text(`${currentUser.createdAt}`);
}
$navUserProfile.on('click', navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $loginForm.hide();
  $signupForm.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
