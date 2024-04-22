const API_TOKEN = "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";
const API_URL = "https://api.github.com";
const DEFAULT_OPTIONS = {
  method: GET,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }
};

export const getUser = async (userName) => {
  const url = new URL(`/users/${userName}`, API_URL)
  const response = await fetch(url, DEFAULT_OPTIONS);
  const data = await response.json();

  // Error handling
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getFollowers = async (userName, amount = 10) => {
  const url = new URL(`/users/${userName}/followers`, API_URL);
  const searchParams = new URLSearchParams({per_page: amount});
  url.search =searchParams;
  const response = await fetch(url, DEFAULT_OPTIONS);
  const data = await response.json();

  // Error handling
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getRepos = async (userName, amount = 10) => {
  const url = new URL(`/users/${userName}/repos`, API_URL);
  const searchParams = new URLSearchParams({page:1, per_page: amount, direction: "desc", sort: "updated"});
  url.search = searchParams;
  const response = await fetch(url, DEFAULT_OPTIONS);
  const data = await response.json();

  // Error handling
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};