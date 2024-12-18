const mockContactsData = {
  "data": [
    {
      "id": "1",
      "type": "contacts",
      "attributes": {
          "first_name": "John",
          "last_name": "Smith",
          "company_id": 1,
          "email": "123@example.com",
          "phone_number": "123-555-6789",
          "notes": "Type notes here...",
          "user_id": 4,
          "company": {
            "id": 2,
            "name": "Future Designs LLC",
            "website": "https://futuredesigns.com",
            "street_address": "456 Future Blvd",
            "city": "Austin",
            "state": "TX",
            "zip_code": "73301",
            "notes": "Submitted application for the UI Designer role."
        }
      }
    },
    {
      "id": "2",
      "type": "contacts",
      "attributes": {
          "first_name": "Jane",
          "last_name": "Smith",
          "company_id": 1,
          "email": "123@example.com",
          "phone_number": "555-555-6789",
          "notes": "Type notes here...",
          "user_id": 4,
          "company": {
            "id": 2,
            "name": "Future Designs LLC",
            "website": "https://futuredesigns.com",
            "street_address": "456 Future Blvd",
            "city": "Austin",
            "state": "TX",
            "zip_code": "73301",
            "notes": "Submitted application for the UI Designer role."
        }
      }
    }
  ]   
}

export { mockContactsData };