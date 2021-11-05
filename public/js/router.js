'use strict';

import { replaceIcons } from "./octicons.js";

function selectTab(id) {
  document.title = String(id)[0].toUpperCase() + String(id).substring(1);
  document.querySelectorAll(".route").forEach(item => item.classList.remove("active"));
  document.querySelectorAll(`#${id}`).forEach(item => item.classList.add("active"));
}

const headers = new Headers();
headers.set("content-type", "text/html; charset=utf-8");

function loadContent(id, scrollTop = 0) {
  const request = new Request("/api/_html/pages/" + id, {
    headers
  });
  const main = document.querySelector("main");
  switch (id) {
    case "projects":
      main.classList.remove("select-home", "select-profile");
      main.classList.add("select-projects");
      break;
    case "home":
      main.classList.remove("select-projects", "select-profile");
      main.classList.add("select-home");
      break;
    case "profile":
      main.classList.remove("select-home", "select-projects");
      main.classList.add("select-profile");
      break;

    default:
      break;
  }
  const parser = new DOMParser();
  fetch(request).then(res => res.text()).then(text => {
    const doc = parser.parseFromString(text, "text/html");
    const section = doc.querySelector("section");

    replaceIcons(section);
    main.replaceChild(section, document.querySelector(`#page-${id}`));
    document.querySelector(`#page-${id}`).scroll(0, scrollTop);
  });
}

function push(event) {
  const id = event.target.id;
  const lastId = window.history.state.id;

  document.querySelector("main").classList.add("allowed-to-anim");
  selectTab(id);
  loadContent(id, window.history.state[id]?.scrollTop);
  window.history.pushState(Object.assign({}, window.history.state, { id }, { [lastId]: { scrollTop: document.querySelector(`#page-${lastId}`).scrollTop } }), `${id}`, `/${id !== "home" ? id : ""}`);
  window.history.state;
}

function onEnterPressed(event) {
  if (event.keyCode === 13) push(event);
}
window.onload = () => {
  const home = document.querySelector("#home");
  home.addEventListener("click", event => push(event));
  home.addEventListener("keypress", onEnterPressed)
  const projects = document.querySelector("#projects");
  projects.addEventListener("click", event => push(event));
  projects.addEventListener("keypress", onEnterPressed);
  const profile = document.querySelector("#profile");
  profile.addEventListener("click", event => push(event));
  profile.addEventListener("keypress", onEnterPressed);

  const id = window.history.state?.id ?? (document.location.pathname !== "/" ? document.location.pathname.substring(1) : "home");
  window.history.replaceState({ id, [id]: { scrollTop: document.querySelector(`#page-${id}`).scrollTop } }, `/${id + "", id !== "home" ? id : ""}`);
  selectTab(id);
  loadContent(id);
}

window.onpopstate = event => {
  const id = event.state.id;
  selectTab(id);
  loadContent(id);
}
