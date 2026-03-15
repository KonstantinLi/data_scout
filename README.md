<h1 align="center">DataScout</h1>

<p align="center">

<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/KonstantinLi/search_engine">
<img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/KonstantinLi/search_engine?color=%23FFC146">
<img alt="GitHub watchers" src="https://img.shields.io/github/watchers/KonstantinLi/search_engine?logo=github">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/KonstantinLi/search_engine">
<img alt="GitHub labels" src="https://img.shields.io/github/labels/KonstantinLi/search_engine/help%20wanted">
<img alt="GitHub labels" src="https://img.shields.io/github/labels/KonstantinLi/search_engine/invalid">
<img alt="GitHub labels" src="https://img.shields.io/github/labels/KonstantinLi/search_engine/bug">

</p>

---

## Description

**DataScout** is a high-tech, load-tolerant tool that provides an API based on smart algorithms
for indexing and further analysis of the content of sites and their child elements - pages.

All information that has been processed by the built-in parser is stored
in a normalized database on the local machine. Thus, the user who will have access to the web interface is able to perform
search queries on indexed sites without Internet access.

<img src="./readme_assets/search.gif" alt="search process" style="width: 100%">

---

## Working principle

+ In the ***config file***, before starting the application, a list of site addresses and their names is specified, by which the engine should search.

```yaml
sites:
  - url: https://www.site.com
    name: site-name
  - ...
```

+ When sending an HTTP request to start indexing, the parser **recursively** goes through all the pages available on the sites and **indexes** them.

<img src="./readme_assets/indexing.gif" alt="indexing" style="width: 100%">

+ The user also has the ability to index a **separate page** that belongs to one of the sites in the configuration.

<img src="./readme_assets/index_page.gif" alt="index page" style="width: 100%">

+ Using the created index, you can find the most ***relevant pages*** for any search query.

+ The sent search query of the user is transformed into a set of so-called ***lemmas*** - words given in the basic form.

+ The index searches for pages where these lemmas occur.

+ The list of found pages is ranked by relevance and given to the user in the form of a list of ***snippets*** - readable sections of text containing the information you are looking for.

<img src="./readme_assets/search.png" alt="snippet" style="width: 100%">

---

## Issues Affected
### 1. Cycle through pages
The parser obviously doesn't know the exact number of pages to crawl, so it crawls them **recursively**, starting from the main one.
> :exclamation: Any page can contain not only links to its child pages, but also links to those pages that are several levels **above**!

Naive traversal of all nested references can result in an infinite :repeat: loop. The solution to the problem lies in two things.
+ `First` is link filtering. A nested link **shouldn't**:
  + link to an external resource;
  + have anchors or document type other than **html**;
  + be equal to the link of the main or current page.

+ `Second` is **caching** links. For this, **Redis** and its _set_ data structure are used, which stores unique members by the specified key.
  If the parser has already visited some page, it will know about it from Redis :sunglasses:

> You can see the implementation of the **validLinks** method [HERE](./src/main/java/searchengine/services/RecursiveWebParser.java).

### 2. Minimizing the number of queries in the database
I/O operations are the bottleneck in the vast majority of systems. Close attention should be paid to the optimization of work with the database.
All data (entity objects) are **buffered** and sent to the database in batches, which contributes to a significant performance boost. After completion of all
the data remaining in the buffer is flushed to the database, and the resources are cleared. Search queries are cached.

> You can drop anything - but never drop the database. She, as an ex, will always remind of herself :trollface:

### 3. RAM limit within the application
The virtual machine is allocated a finite amount of memory. The system uses ORM technology that displays the received data
as objects stored in heap. The system is processing a large amount of data, which can cause this heap to overflow and crash :warning:.
Therefore, information is provided in portions, reducing the load on the system.

### 4. Reaction to a stoplight
The indexing emergency termination mechanism has been implemented: when a necessary HTTP request is called, the system interrupts all work tasks.

___

## Technology stack
+ Java 17
+ Maven
+ Spring/Spring Boot 3, Thymeleaf
+ PostgreSQL, Redis
+ Apache Lucene

---

## Instructions for running the program locally

### System requirements
#### Minimal configuration
>**Processor**: Intel Core i3-12100F, AMD Ryzen 5 2600X
>
>**RAM**: 8 GB RAM
>
>**Hard disk space**: 10 GB
> 
>**Internet connection**: 50 Mbps

#### Recommend configuration
>**Processor**: Intel Core i5-12500H, AMD Ryzen 5 5500
>
>**RAM**: 16 GB RAM
>
>**Hard disk space**: 20 GB
>
>**Internet connection**: 100 Mbps

### Procedure
+ First, you need to download Docker Desktop to deploy your system. The current version of the application can be 
downloaded from the official website [Docker](https://www.docker.com/products/docker-desktop/).

+ Download the archive with the necessary files according to your OS:
  + Windows: [csc-engine-windows.zip](./release/csc-engine-windows.zip)
  + Linux/macOS: [csc-engine-linux.zip](./release/csc-engine-linux.zip)

+ Unzip the archive to any directory.

+ The archive contains the following files:
  + **docker-compose.yml** - file to deploy the web application
  + **application.yaml** - configuration file
  + **deploy.bat** для Windows або **deploy.sh** для Linux/macOS - executable file

+ Run the executable file. This can be done by double-clicking on the file, or through the command line. Note that when 
running a file in Linux, you need to give it the appropriate rights, for this, enter the command `sudo chmod +x deploy.sh`.

+ The application has been successfully launched. To enter the interface, open the page in a web browser at the link **localhost:8081**.

Enjoy! :sunglasses:
