"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList, showDeleteBtn, idToRemove;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
const showStar = Boolean(currentUser);
//const showDeleteBtn = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}  
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>

        ${showDeleteBtn ? getEditBtnHTML() : ""}
      </li>
    `);
}
// line 32: <small class="story-hostname">(${hostName})</small>
/** Make favorite stars **/
function getStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
        <span class="star">
          <i class="${starType} fa-star"></i> 
        </span>`;
}

/** Make delete button HTML for story */
function getDeleteBtnHTML(){
  return `
    <span class="trash-can">
    <i class="fas fa-trash-alt"></i>
    </span>`;
}

/** Make Edit story button HTML*/
function getEditBtnHTML(){
  return `
    <span class= "edit-story">
    <i class="fas fa-mug-hot">Edit</i>
    </span>`;
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle submitting new story form. */
async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const story = await storyList.addStory( currentUser, {title, url, author, username} ); //, username
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $myStories.append($story);
   $favoriteStories.hide();
   $myStories.hide();
  $addStoryForm.slideUp("slow");
  $addStoryForm.trigger("reset");
}

$addStoryForm.on("submit", submitNewStory);

  /******************************************************************************
* Functionality for list of user's own stories*/
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
                                                //  console.log(currentUser.myStories);
  $myStories.empty();
    if(currentUser.myStories.length === 0){
      $myStories.append("<h5>No stories added by user!</h5>");
    } else {
      // loop through all of users stories and generate HTML for them
      for (let story of currentUser.myStories) {
        let $story = generateStoryMarkup(story, true);
        $myStories.append($story);
      }  
    }
      $myStories.show();
}

/** Handle deleting a story. */
async function deleteStory(evt) {
  console.debug("deleteStory");
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  // re-generate story list
  await putUserStoriesOnPage();
  }
  $myStories.on("click", ".trash-can", deleteStory);

  /* Allow user to edit own stories */
async function editStory(evt){
  console.debug("editStory", evt);
  hidePageComponents();
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");                  
  idToRemove = storyId;

  let editedStory = await storyList.retrieveMyStory(currentUser, storyId);
  $updateStoryForm.show();
  $("#author-update").val(editedStory.author);
  $("#title-update").val(editedStory.title);
  $("#url-update").val(editedStory.url)
}
  $myStories.on('click', ".edit-story",editStory);

async function updateMyStory(evt){
  console.debug("updateMyStory");
  evt.preventDefault();                    
  const author = $("#author-update").val();            
  const title = $("#title-update").val();
  const url = $("#url-update").val();
  const username = currentUser.username;
  const story = await storyList.addStory( currentUser, {title, url, author, username} ); //, username
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $myStories.append($story);
   $favoriteStories.hide();
   $myStories.hide();
  $updateStoryForm.slideUp("slow");
  $updateStoryForm.trigger("reset");
    await storyList.removeStory(currentUser,idToRemove);
}
$updateStoryForm.on("submit", updateMyStory);


/******************************************************************************
* Functionality for favorites list and starr/un-starr a story
*/
/** Put favorites list on page. */
function putFavoriteOnPage() {
  console.debug("putFavoriteOnPage");
  $favoriteStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStories.append("<h5>No favorites added!</h5>");
    } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStories.append($story);
    }
  }
    $favoriteStories.show();
}

/** Handle favorite/un-favorite a story */
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");
  const $et = $(evt.target);
  const $closestLi = $et.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  // see if the item is already favorited (checking by presence of star)
  if ($et.hasClass("fas")) {
  // currently a favorite: remove from user's fav list and change star
  await currentUser.removeFavorite(story);
  $et.closest("i").toggleClass("fas far");
  } else {
  // currently not a favorite: do the opposite
  await currentUser.addFavorite(story);
  $et.closest("i").toggleClass("fas far");
  }
  }
  $allStoriesList.on("click", ".star", toggleStoryFavorite);