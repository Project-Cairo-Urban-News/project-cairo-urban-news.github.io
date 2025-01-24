---
title: Technical Description
layout: doc_en.njk
---

The “Digital Cairo” project involved creating a vocabulary of mark-up (a minimal set of elements and attributes, better known as a “schema”) and a partially automated workflow for the XML transformation and TEI mark-up of Arabic-character-based texts from Microsoft Word documents. The workflow utilizes the Oxygen editing software and GitHub for collaborative mark-up, automation, and storage. Hugh Cayless undertook the bulk of the coding and design, with Adam Mestyan assisting with lower-level coding tasks. Once the editors declared a marked-up file finalized, further automated transformations assigned IDs to groups of data. Indexes were then created using XSLT transformations. Finally, Hugh Cayless and Adam Mestyan developed this website using GitHub. We believe that one of the major contributions of this project to (Arabic-script-based) digital humanities is its workflow.

This document outlines the workflow, including details about automated GitHub actions and other technical processes, such as creating the timeline on this website. Beginners in using Oxygen software for TEI mark-up of Arabic-character-based documents can visit our website for a crash course with basic definitions: https://arabic-tei-workshop.github.io/index.html. For more technical details, see the paper by Cayless and Mestyan HERE.

## 1. Our schema

We developed a TEI ODD schema focused on a basic document structure with support for marking names of persons, places, and organizations. Additional constraints were introduced, mainly to help editors identify errors involving misplaced spaces, which can be difficult to detect in Oxygen’s Author mode. As we gained insights into our data, we added new features to the schema, such as suggested values for the type attribute to aid editors in marking up the articles.

## 2. Our Workflow
   
### 2.1 Creating Data in Microsoft Word Documents
   
Adam Mestyan and Mercedes Volait defined criteria for the research assistants tasked with reading, selecting, and transcribing articles from al-Waqāʾiʿ al-Miṣriyyah. These criteria encompassed articles about urban development in Cairo, including destruction and reconstruction, urban regulations and policies, auctions of urban property, pious endowments in Cairo, infrastructure changes (e.g., roads, bridges, trains, transportation), and natural catastrophes like earthquakes.

Based on these criteria, Sarah Fathallah Garaah, Karima Nasr, and Rezk Nori read and manually transcribed articles from the microfilms of al-Waqāʾiʿ al-Miṣriyyah (1828–1914) stored at Dār al-Kutub al-Miṣriyyah. Similarly, Arif Erbil and Huseyin Sağlam manually transcribed articles from the Ottoman issues available at the Atatürk Kitaplığı. The output consisted of Arabic-script texts in Microsoft Word documents with varied formatting and date systems (hijrī and mīlādī), which caused initial inconsistency.

At this early stage, the decision was made to treat individual articles as the basic data unit, accompanied by their bibliographical details, including the publication dates in both hijrī and Gregorian calendars (Coptic dates, used between 1865 and 1882, were disregarded).

### 2.2 Basic Editing of MS Word Documents and Organization by Hijrī Years

Due to inconsistencies in the data, Mestyan invested considerable time in manually editing and standardizing the texts in the Word documents. Meanwhile, Volait reviewed the drafts and created a timeline highlighting missing issues. Mestyan decided to organize the editing work by hijrī years, with each Word document ideally containing one hijrī year. For post-1870 issues with larger volumes of text, some hijrī years were split into multiple files.

### 2.3 First Automated Transformation: MS Word to XML with Basic Mark-up

Once the standardized Word files were organized by hijrī year, Hugh Cayless designed a GitHub Action for automated conversion and basic mark-up. New Word files pushed to the repository triggered this action, which used the TEI Stylesheets Word to XML converter. The resulting XML underwent additional cleanup and standardization to create a TEI document ready for editing.

This system included a master XML file containing TEI Header information common to all source files. Updates to this master file triggered a GitHub Action that synchronized the TEI Headers across all other XML files, facilitating centralized management.

### 2.4 Manual Editing and Mark-up, Including Non-Unicode Glyphs

After generating a preliminary TEI XML document, mark-up editors properly edited the text using our TEI schema. Mestyan distributed files to one or two editors, who manually marked up the content for machine-readability. They used the oXygen sofware's author mode. Each file was linked to a CSS file so oXygen's author mode could function as an HTML site to make the editing and display of Arabic (right-to-left) text easy. During this process, glyphs representing fraction numbers (from the late 1870s–early 1880s) with no Unicode equivalent posed a challenge. Cayless addressed this by designing small JPEGs as placeholders for these glyphs

Control checks followed, involving:

- Sarah Fathallah Garaah and later Ahmed Kamal reviewed each file for typos, unclear terms, and mark-up issues. They or Mestyan verified questionable terms against the originals in microfilms or online copies. Through GitHub Cayless created also HTML-rendered files for easier reading.
- Mercedes Volait printed the HTML texts as PDFs, annotated them with corrections, and returned them to Mestyan for review.
- Finally, Mestyan took over and compared every single file with the various versions, often requesting one of the researchers to go back (yet again!) to Dār al-Kutub. Once he was satisfied with a file’s content and mark-up he “cleared” the file – meaning he added the attribute status: cleared![

### 2.5 Second Automated Transformation: Adding IDs
Once a document was marked as “cleared” by Mestyan, a GitHub Action assigned unique xml:id attributes to article divisions, person names, place names, and organization names. This ensured consistent identification within the dataset.

## 3. XSLT Transformation of Data for Indexes
[in progress] An XQuery program extracts marked personal names from the source documents, performs basic collation, and generates a TEI document listing person definitions with associated names and document locations. OpenRefine further refines this data, aligning it where possible with online gazetteers and Wikidata entries.

## 4. Creating the Website Timeline
Website files are organized by hijrī year and month using the article header data. A GitHub Action manages the publishing process, splitting articles into separate files and converting TEI XML into HTML Custom Elements using CETEIcean. These elements are styled with CSS and JavaScript.



