function createPostItem(postData) {
  const post = document.createElement("li");
  post.classList.add("list-group-item");
  const postListItem = `<a href='post.html?postId=${postData.id}'>${postData.title} - ${postData.description}</a>`;
  post.innerHTML = postListItem;
  const deletePostButton = document.createElement("button");
  deletePostButton.classList.add("btn", "btn-danger");
  deletePostButton.setAttribute("id", "delete-post-button");
  deletePostButton.setAttribute("type", "button");
  deletePostButton.textContent = "delete";
  deletePostButton.addEventListener("click", () => deletePost(postData.id));
  post.appendChild(deletePostButton);
  return post;
}

function populatePostsList(postsData) {
  const postsList = document.createElement("ul");
  postsList.classList.add("list-group");
  for (const i in postsData) {
    const post = createPostItem(postsData[i]);
    postsList.appendChild(post);
  }
  document.getElementsByTagName("main")[0].appendChild(postsList);
}

function getPostsListFromServer() {
  fetch("http://localost/api/posts")
  // fetch("http://127.0.0.1:8081/api/posts")
    .then((response) => response.json())
    .then((postsData) => populatePostsList(postsData));
}

function addCreatedPostToList(response) {
  // function addCreatedPostToList(response, defaultPostBody) {
  // if (response.status !== 200) {
  //   return;
  // }
  // const post = createPostItem(defaultPostBody);
  const post = createPostItem(response);
  const postsList = document.querySelector("main > ul");
  postsList.appendChild(post);
}

function addDefaultPost() {
  const defaultPostBody = {
    "title": "Default post title",
    "description": "Default post desc"
    }
    fetch("http://127.0.0.1:8081/api/posts", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(defaultPostBody),
    
   
  })
  .then(response => response.json())
  .then(data => addCreatedPostToList(data));
}

function deletePost(postId) {
  fetch(`http://127.0.0.1:8081/api/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => deletePostItemFromList(response, postId));
}

function deletePostItemFromList(response, postId) {
  if (response.status !== 200) {
    return;
  }
  const postItemToDelete = document.querySelectorAll(
    `a[href='post.html?postId=${postId}']`
  );
  postItemToDelete[0].parentElement.remove();
}

function addListeners() {
  document.getElementById("add-post-button").onclick = () => addDefaultPost();
}

window.onload = () => {
  getPostsListFromServer();
  addListeners();
};
