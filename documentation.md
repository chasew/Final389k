
# College Park Restaurant Reviews

---

Names: Kelly White, Chase Wooten, Ryan Davis

Date: December 6th, 2019

Project Topic: College Park Restaurant Reviews

URL: localhost:3000/

---

### 1. Midterm Project Requirements
### 1.1 Data Format and Storage

Uses mongodb for storage

Schema: 
restaurantSchema
title: {
    type: String,
    required: true
},
food: {
    type: String,
    required: true
},
rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
}

### 1.2 Add New Data

HTML form route: `/create`

POST endpoint route: `/api/create/:username/:restaurant_name/:slug/:[ts]/:content/:review`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/create',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
      user: "k1",
      restaurant_name: "Tea",
      slug: "k1_tea",
      tags: [ "Tea" ],
      content: "<p>Tea</p>\n",
      review: 5,
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 1.3 View Data

GET endpoint route: `/api`

### 1.4 Search Data

Search Field: `restaurant_name`

### 1.5 Navigation Pages

Navigation Filters
1. Tags -> `/tag/:tag`
2. 5 Stars -> `/tag/:tag`
3. Newest -> `/nav/Newest`
4. Alphabetical -> `/nav/Alphabetical`
5. Random -> `/nav/Random`


### 2. Live Updates
Incorporated sockets into a chatroom using socket.io

### 3. View Data
form submission page: create.handlebars
view at localhost:3000/create

about page: about.handlebars
view at localhost:3000/about

### 4. API
Post a review:
localhost/3000/api/create/:username/:restaurant_name/:slug/:array/:content/:review

Delete a tag from a review:
localhost/3000/api/slug/:slug/remove/:tag

### 5. Modules

### 6. NPM Packages
1. Flickity
to view, go to localhost:3000
Under Featured Restaurants, flickable list of restaurant logos

2. Draggabilly
to view go to localhost:3000/extra
Drag Square around

### 7. User Interface
Used Coolor.co

### 8. Deployment
