"use strict";
const missingImgUrl = "http://tinyurl.com/missing-tv";
const apiUrl = "http://api.tvmaze.com/";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodesList");
let $term = $(".form-control").val();

async function getShowsByTerm(term) {
  const response = await axios({
    url: `${apiUrl}search/shows?q=${term}`,
    method: "GET",
  });

  return response.data.map((result) => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : missingImgUrl,
    };
  });
}

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `
    );

    $showsList.append($item);
  }
}

async function searchForShowAndDisplay() {
  let $term = $(".form-control").val();
  const shows = await getShowsByTerm($term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay($term);
});

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  const episodes = res.data.map((episode) => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
      ${episode.name}, season ${episode.season}, episode ${episode.number}
      </li>`
    );
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}

$("#shows-list").on(
  "click",
  ".episodes",
  async function handleEpisodeClick(evt) {
    let showId = $(evt.target).closest(".Show").data("show-id");
    let episodes = await getEpisodes(showId);
    populateEpisodes(episodes);
  }
);
