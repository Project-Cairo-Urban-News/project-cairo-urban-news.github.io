---
title: Indexes
layout: doc_ar.njk
---
<style>
  .explore-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 20px;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  h2 {
    font-size: 1.5rem;
    color: white;
    margin-bottom: 15px;
  }

  .index-button {
    background-color: transparent;
    border: 2px solid white;
    color: white;
    font-size: 1.2rem;
    padding: 10px 30px;
    margin: 5px 0;
    cursor: pointer;
    transition: background-color 0.5s ease, color 0.5s ease;
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
    <button class="index-button" data-language="ar" data-type="orgTypes">عربي</button>
    <button class="index-button" data-language="ota" data-type="orgTypes">التركية العثمانية</button>
  </div>

  <div class="column">
    <h2>أنواع الأماكن</h2>
    <button class="index-button" data-language="ar" data-type="placeTypes">عربي</button>
    <button class="index-button" data-language="ota" data-type="placeTypes">التركية العثمانية</button>
  </div>

  <div class="column">
    <h2>أدوار الأشخاص</h2>
    <button class="index-button" data-language="ar" data-type="roles">عربي</button>
    <button class="index-button" data-language="ota" data-type="roles">التركية العثمانية</button>
  </div>
</div>
