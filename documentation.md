
# College Park Restaurant Reviews

---

Name: Kelly White

Date: November 1st, 2019

Project Topic: College Park Restaurant Reviews

URL: localhost:3000/

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: user					`Type: String`
- `Field 2`: restaurant_name        `Type: String`
- `Field 3`: slug				    `Type: String`
- `Field 4`: tags			        `Type: [String]`
- `Field 5`: content		        `Type: String`
- `Field 6`: review		            `Type: Number`
- `Field 7`: preview		        `Type: String`
- `Field 8`: time			        `Type: Date`

Schema: 
```javascript
{
   user: String,
   restaurant_name: String,
   slug: String,
   tags: [String],
   content: String,
   review: Number,
   preview: String,
   time: Date
}
```

### 2. Add New Data

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

### 3. View Data

GET endpoint route: `/api`

### 4. Search Data

Search Field: `restaurant_name`

### 5. Navigation Pages

Navigation Filters
1. Tags -> `/tag/:tag`
2. 5 Stars -> `/tag/:tag`
3. Newest -> `/nav/Newest`
4. Alphabetical -> `/nav/Alphabetical`
5. Random -> `/nav/Random`

