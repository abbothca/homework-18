// import { getUser, getFollowers } from "./api.js";
import { getUser, getFollowers, getRepos } from "./api.js";
import { formatDate } from "./date.js";
import { showAlert, hideAlert } from "./alert.js";
import { debounce } from "./utils.js";

// DOM variables
const inputSearch = document.querySelector(".searchUser");
const profile = document.querySelector(".profile");

const createLayout = ({
  avatar_url,
  html_url,
  public_repos,
  public_gists,
  followers,
  following,
  company,
  blog,
  location,
  created_at,
}) => {
  profile.innerHTML = `
    <div class="card card-body mb-3">
        <div class="row">
            <div class="col-md-3">
                <img class="img-fluid mb-2" src="${avatar_url}">
                <a href="${html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
            </div>

            <div class="col-md-9">
                <span class="badge badge-primary">Public Repos: ${public_repos}</span>
                <span class="badge badge-secondary">Public Gists: ${public_gists}</span>
                <span class="badge badge-success">Followers: ${followers}</span>
                <span class="badge badge-info">Following: ${following}</span>
                <br><br>

                <ul class="list-group">
                    <li class="list-group-item">Company: ${company || "No company"
    }</li>
                    <li class="list-group-item">Website/Blog: ${blog}</li>
                    <li class="list-group-item">Location: ${location}</li>
                    <li class="list-group-item">Member Since: ${formatDate(
      created_at
    )}</li>
                </ul>
            </div>
        </div>
    </div>

    <h3 class="page-heading mb-3">Followers</h3>
    <div class="followers"></div>

    <h3 class="page-heading mb-3">Latest Repos</h3>
    <div class="repos"></div>
`;
}

const showList = (selector, arr, fn) => {
  const parent = document.querySelector(`${selector}`);
  const list = document.createElement("ul");
  list.classList.add("list-group");

  arr.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = fn(item);

    list.append(li);
  });

  parent.append(list);
}

const showFollower = (follower) => {
  return `${follower.login}`
}

const showRepo = (repo) => {
  return `<h5><a href="${repo.clone_url}" target="_blank">${repo.name}</a></h5>
  <p>${repo.description}</p> `;
}

const showProfile = (user, followersList, reposList) => {
  createLayout(user);
  showList(".followers", followersList, showFollower);
  showList(".repos", reposList, showRepo);
};

const clearProfile = () => {
  profile.innerHTML = "";
};

const handleInput = async ({ target: { value } }) => {
  try {
    // Ховати карточку користувача
    clearProfile();
    // Ховати повідомлення про помилку
    hideAlert();

    const inputValue = value.trim();
    if (!inputValue) {
      return;
    }

    const user = await getUser(inputValue);
    const [followers, repos] = await Promise.all([getFollowers(inputValue, 6), getRepos(inputValue, 5)]);

    showProfile(user, followers, repos);
  } catch (error) {
    showAlert(error.message, "danger", 2000);
  }
};

// Event listeners
inputSearch.addEventListener("input", debounce(handleInput, 1500));
