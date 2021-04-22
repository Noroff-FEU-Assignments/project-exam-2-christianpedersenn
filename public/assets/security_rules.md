1. Go to https://console.firebase.google.com/project/
2. Select your Firebase project
3. Click the "Database" link in the sidebar and then "Rules" in the navigation tab.
4. Remove everything and copy-paste the code below:

    service cloud.firestore {
        match /databases/{database}/documents {
            match /{users=**} {
            allow read, write: if request.auth.uid != null;
            }
            match /{roles=**} {
            allow read, write: if request.auth.uid != null;
            }    
            match /{settings=**} {
            allow read, write: if request.auth.uid != null;
            }    
            match /{incidents=**} {
            allow read;
            } 
            match /{components=**} {
            allow read;
            }      
        }
    }

5. Click "Publish"
6. You can now go back to the setup and update the user.