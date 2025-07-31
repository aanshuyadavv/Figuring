# PROBLEMS.md – Things That Went Wrong While Making Figuring (and How I Fixed Them)

This file is like my diary of all the bugs, mistakes, and confusing things I faced while building Figuring — and how I figured them out step by step.

---

## LOGIN, SIGNUP & OTP

### 1. Imported the wrong file
I accidentally used a frontend file in the backend.  
It caused errors because frontend files can’t run in backend.  
I removed the wrong import and used the correct backend function.

### 2. OTP email didn’t work
Emails weren’t reaching users.  
I used Nodemailer with Gmail. That fixed it.

### 3. Resend OTP sent it too many times
Even if the OTP was still valid, it sent a new one again and again.  
I checked if an OTP already exists and is still good before sending a new one.

### 4. “Import” not working in backend
Got this error: "Cannot use import statement outside a module".  
I switched to require() instead of import, which is the right way in backend without special setup.

---

## FORMS

### 5. Placeholder looked filled, but value was empty
I used placeholder, thinking it would submit the value too — it didn’t.  
I used defaultValue or setValue() to actually fill the input.

### 6. Edit form didn’t show data at first
I clicked edit, but the form was empty until 1 second later.  
I used setValue() when the data arrived to fill the form properly.

---

## CART SYSTEM

### 7. Added to cart even without clicking
The course got added to cart automatically on page load.  
I removed the function from useEffect() and ran it only when the user clicks.

### 8. Cart not updated after deleting from DB
I deleted cart from backend, but frontend still showed old items.  
I cleared Redux and localStorage to sync everything.

### 9. Paid courses stayed in cart
Even after buying a course, it stayed in cart.  
After payment, I fetched the new (empty) cart from backend and updated Redux.

### 10. Token issue with localStorage
I saved the token like JSON.stringify(token) which added extra quotes and broke login.  
I just saved the token as plain text using localStorage.setItem("token", token).

---

## COURSE SYSTEM

### 11. Wrong reviews were showing
I sent user and course ID as string, but they should be ObjectId.  
I sent the correct format and filtered reviews properly.


## ENV VARIABLES

### 12. API URL not working
I used process.env.BASE_URL but it gave undefined.  
I changed it to REACT_APP_BASE_URL (React only reads vars that start with REACT_APP_).

---

## AUTH SYSTEM

### 13. No redirect after login
User logged in but stayed on the same page.  
I used useNavigate() to move them to dashboard.

### 14. Token not sent to backend
Backend said user not logged in.  
I fixed it by sending the token in headers like Authorization: Bearer <token>.

### 15. Private pages were public
Users could open dashboard even without login.  
I made a wrapper to check the token and block access if not logged in.

---

## PAYMENTS

### 16. Razorpay didn’t open
Clicking “Buy Now” did nothing.  
I loaded Razorpay’s script before trying to use it.

### 17. User paid but no course access
Payment worked, but user still didn’t get the course.  
I verified payment on backend, then enrolled the user.

### 18. Payment signature was wrong
Razorpay sent a signature but it didn’t match in backend.  
I used crypto.createHmac() properly with the right format.

---

## REVIEWS AND RATINGS

### 19. Wrong reviews showed up
User opened one course but saw reviews of another.  
I checked if courseId is valid before fetching reviews.

### 21. New review didn’t appear
User submitted review but UI didn’t update.  
I called the fetch function again after submission.

### 22. Same user gave multiple reviews
One user could review the same course 2–3 times.  
I added a check: only one review per user per course.

---

## DESIGN ISSUES

### 23. Modal looked ugly
It had poor spacing, bad fonts.  
I redesigned it with Tailwind CSS and better layout.

### 24. Star rating not working
Clicking stars didn’t change the value.  
I connected the stars to the form using setValue().

---

## OTHER BUGS

### 25. Redux not synced with localStorage
Cart updates were not saved across refresh.  
I stored Redux data in localStorage every time it changed.

### 26. Too many API calls
Same API was being called multiple times.  
I fixed the useEffect dependencies to call it only once.

### 27. Backend errors were not helpful
It always said “Something went wrong”.  
I added clear error messages with res.status().json({ message: "..." }).

---

## What I Learned

Made with a lot of bugs and fixes.
