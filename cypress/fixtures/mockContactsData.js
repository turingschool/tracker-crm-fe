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
    },
    {
      "id": "3", // Add Alice Green here
      "type": "contacts",
      "attributes": {
          "first_name": "Alice",
          "last_name": "Green",
          "company_id": 3,
          "email": "alice.green@example.com",
          "phone_number": "555-555-5555",
          "notes": "Note about Alice",
          "user_id": 4,
          "company": {
            "id": 3,
            "name": "Company A",
            "website": "https://companya.com",
            "street_address": "123 Main St",
            "city": "Dallas",
            "state": "TX",
            "zip_code": "75201",
            "notes": "New company contact."
          }
      }
    }
  ]   
}

export { mockContactsData };