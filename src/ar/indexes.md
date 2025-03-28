---
title: Indexes
layout: doc_ar.njk
---
<style>
  /* Center the "فهارس" text */
  h1 {
    text-align: center;
    color: black;
    font-size: 2rem;
    margin-top: 20px;
  }

  .explore-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
    justify-content: center; /* Center the buttons horizontally */
    align-items: center; /* Center the buttons vertically */
    text-align: center; /* Center the text inside the buttons */
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  h2 {
    font-size: 1.5rem;
    color: black; /* Change the header text color to black */
    margin-bottom: 15px;
  }

  .index-button {
    background-color: transparent;
    border: 2px solid black; /* Change the button border to black */
    color: black; /* Change the button text color to black */
    font-size: 1.2rem;
    padding: 10px 30px;
    margin: 5px 0;
    cursor: pointer;
    transition: background-color 0.5s ease, color 0.5s ease;
    text-decoration: none; /* Remove underline from links */
  }

  .index-button:hover {
    background-color: #507f93;
    color: white;
  }
</style>

<h1>فهارس</h1>

<div class="explore-buttons">
  <div class="column">
    <h2>أنواع المنظمات</h2>
    <a href="/en/indexes/orgTypesAr.html" class="index-button">عربي</a>
    <a href="/en/indexes/orgTypesOta.html" class="index-button">التركية العثمانية</a>
  </div>

  <div class="column">
    <h2>أنواع الأماكن</h2>
    <a href="/en/indexes/placeTypesAr.html" class="index-button">عربي</a>
    <a href="/en/indexes/placeTypesOta.html" class="index-button">التركية العثمانية</a>
  </div>

  <div class="column">
    <h2>أدوار الأشخاص</h2>
    <a href="/en/indexes/rolesAr.html" class="index-button">عربي</a>
    <a href="/en/indexes/rolesOta.html" class="index-button">التركية العثمانية</a>
  </div>
</div>
