# SACE Connect Portal

# Build Prompt — SACE QR Registration & Response Management Portal

Build a complete, production-ready, responsive web application for **SACE** that works as a QR-code-driven enquiry/registration form for students.

The application has two primary parts:

1. **Public Student Form**
2. **Hidden Admin Dashboard**

The entire experience must be mobile-first because most users will access the form by scanning a QR code from their phones.

---

# 1. BRANDING & DESIGN

Use **SACE branding throughout the application**.

### Brand

* Organisation: **SACE**
* Use the SACE logo prominently at the top of the public form.
* Keep the design professional, premium, modern and education-focused.
* The interface should feel trustworthy and polished rather than like a generic Google Form.

### Design direction

* Clean modern education/consulting aesthetic.
* Generous spacing.
* Rounded cards and input fields.
* Subtle shadows.
* Smooth animations and transitions.
* Strong visual hierarchy.
* Excellent mobile responsiveness.
* Desktop layout should also look polished.

### Important

The public form should be extremely easy to complete on a mobile phone.

Do not overcrowd the screen.

---

# 2. PUBLIC LANDING / FORM PAGE

The QR code should open the public form page.

Suggested route:

`/`

The page should contain:

### Header

* SACE logo
* SACE tagline beneath or beside the logo.
* Keep the branding visually prominent but compact.

### Main heading

**What are you looking for?**

Provide a dropdown/select field.

Dropdown options:

1. **Internship Program**
2. **Immersion Program**

The user must select one option before proceeding.

---

# 3. USER FORM

After selecting the program, display the registration/enquiry form.

The following fields are common to both programs:

### Required fields

**Full Name**

* Label: `Name`
* Required
* Text input

**WhatsApp Number**

* Label: `Phone Number (WhatsApp)`
* Required
* Phone input
* Validate that it is a reasonable phone number.
* Allow international numbers where practical.

**Email**

* Label: `Email`
* Required
* Email validation

**College**

* Label: `College`
* Required
* Text input

### Program

The selected program must also be stored:

* Internship Program
  OR
* Immersion Program

Do not ask the user to select the program again after they have already selected it.

---

# 4. FORM UX

The form should have a clear primary CTA.

Button:

**Submit**

While submitting:

* Disable the button.
* Show a loading state.
* Prevent duplicate submissions.

After successful submission, show a professional success screen.

Example:

**Thank You!**

Your response has been successfully submitted to SACE.

We will get in touch with you shortly.

Include a button:

**Submit Another Response**

which returns the user to a fresh form.

Do not expose the admin dashboard or any admin functionality on the public page.

---

# 5. FORM VALIDATION

Implement proper client-side and server-side validation.

Required:

* Name cannot be empty.
* WhatsApp number cannot be empty.
* Email must be valid.
* College cannot be empty.
* Program selection is mandatory.

Display clean inline validation messages.

Example:

`Please enter your name.`

`Please enter a valid email address.`

`Please enter your WhatsApp number.`

Avoid browser-default ugly validation wherever possible.

---

# 6. DATABASE

Create a proper database for storing all submissions.

Use Supabase if available in the Lovable project.

Create a table such as:

`responses`

Fields:

* `id` — UUID / primary key
* `program_type` — Internship Program / Immersion Program
* `name`
* `phone_whatsapp`
* `email`
* `college`
* `submitted_at`
* `updated_at`

Store timestamps automatically.

Use the database as the single source of truth.

Do not store submissions only in localStorage.

---

# 7. SECURITY

The public form must only be able to create a submission.

Users must NOT be able to:

* View other responses.
* Access the admin dashboard.
* Edit responses.
* Delete responses.
* Access database records directly through the frontend.

Configure appropriate Supabase Row Level Security policies.

The admin dashboard must use proper authentication rather than relying only on frontend route protection.

---

# 8. HIDDEN ADMIN ACCESS

The admin dashboard should not have a visible "Admin Login" button on the public form.

Instead implement a hidden access mechanism:

### Logo interaction

When the user taps/clicks the **SACE logo 5 times consecutively**, open an Admin Login modal.

Important:

* Five clicks/taps must occur within a reasonable short interval, e.g. 3 seconds.
* Reset the counter if the user stops clicking for too long.
* Do not show an obvious admin link.
* This interaction must work on both mobile and desktop.

After the fifth click:

Open a modal:

### Admin Login

Fields:

**Email**

**Password**

Button:

**Login**

---

# 9. ADMIN LOGIN CREDENTIALS

For the initial/demo administrator account use:

Email:
`admin@sace.com`

Password:
`123456789`

IMPORTANT SECURITY REQUIREMENT:

Do not hard-code these credentials into frontend JavaScript.

Create the administrator using the authentication system/database.

The password must be stored securely using the authentication provider.

The frontend should never contain the plain-text password.

If Supabase Auth is being used, create/configure the admin account through Supabase authentication and restrict dashboard access to the authorised admin account.

Structure the system so the credentials can be changed later without modifying frontend code.

---

# 10. ADMIN DASHBOARD

After successful login redirect to:

`/admin`

Create a professional SACE-branded admin dashboard.

### Dashboard header

Show:

SACE logo

**Response Management Dashboard**

Admin email/account indicator.

A:

**Logout**

button.

---

# 11. DASHBOARD SUMMARY CARDS

At the top show clear statistics.

Cards:

### Total Responses

Total number of submitted responses.

### Internship Program

Number of responses where program = Internship Program.

### Immersion Program

Number of responses where program = Immersion Program.

### Colleges

Number of unique colleges represented.

These values must be calculated dynamically from the database.

---

# 12. RESPONSE MANAGEMENT

Below the statistics, display all responses in a clean table.

Desktop table columns:

| Date | Name | Phone | Email | College | Program | Actions |

For mobile:

* Convert the table into responsive cards/list rows.
* Do not force users to horizontally scroll unnecessarily.

Each response should show:

* Submission date/time
* Name
* WhatsApp number
* Email
* College
* Program

---

# 13. SEARCH

Add a search bar above the responses.

Placeholder:

**Search responses...**

Search across:

* Name
* Phone number
* Email
* College

Search should update results dynamically.

---

# 14. FILTERING

Provide filtering controls.

### Program filter

Options:

* All Programs
* Internship Program
* Immersion Program

### College filter

Provide a dropdown populated dynamically from colleges in the database.

Options:

* All Colleges
* Individual colleges

---

# 15. DATE-WISE SORTING / FILTERING

The admin must be able to sort responses date-wise.

Provide:

### Sort by

* Newest First
* Oldest First

Also provide optional date filters:

**From Date**

**To Date**

This allows the admin to see responses submitted during a specific period.

---

# 16. RESPONSE DETAILS

When the admin clicks a response, open a detailed response view/modal.

Display the information in a professional SACE-branded format:

### Response Details

**Program**
Internship Program / Immersion Program

**Name**
Student name

**Phone Number (WhatsApp)**
Phone

**Email**
Email

**College**
College

**Submitted On**
Date and time

Include:

**Download PDF**

button.

---

# 17. INDIVIDUAL PDF DOWNLOAD

The admin must be able to download a single response as a PDF.

The PDF should be professionally formatted.

PDF structure:

SACE logo

SACE tagline

---

**Student Response**

Program:
[Program]

Name:
[Name]

Phone Number (WhatsApp):
[Phone]

Email:
[Email]

College:
[College]

Submitted On:
[Date and Time]

---

SACE branding should appear throughout the PDF.

Use a clean professional layout suitable for record keeping.

The filename should be something like:

`SACE_Response_[StudentName].pdf`

Sanitize filenames so special characters do not break downloads.

---

# 18. DOWNLOAD ALL RESPONSES

Add a prominent dashboard button:

**Download All Responses**

When clicked, allow the admin to download all responses.

Preferably generate a ZIP file containing individual PDFs for each response.

If ZIP generation is not practical in the current Lovable environment, provide a single professionally formatted PDF containing all responses, with each response clearly separated.

Filename:

`SACE_All_Responses_[Date].pdf`

The export must respect the currently selected filters if the admin has filtered the table.

For example:

If the admin selects:

* Internship Program
* College = ABC College
* Date range = August 1–28

then "Download All Responses" should export only those filtered results.

---

# 19. EXPORT UX

When generating PDFs:

* Show a loading/progress state.
* Prevent multiple simultaneous export requests.
* Display a success notification after download generation.

If there are no responses matching the current filters, show:

**No responses available for export.**

Do not generate an empty PDF.

---

# 20. ADMIN DASHBOARD EMPTY STATE

If there are no responses yet, show a professional empty state.

Example:

**No responses yet**

Student responses submitted through the SACE QR form will appear here.

---

# 21. REAL-TIME / DATA REFRESH

The dashboard should always display current database data.

Add a:

**Refresh**

button.

When clicked, reload the latest responses and statistics.

If practical, use Supabase realtime subscriptions so new submissions can appear without manually refreshing.

---

# 22. PAGINATION

If there are many responses, do not load thousands of records into the browser at once.

Implement pagination.

Suggested:

* 25 responses per page.

Controls:

Previous

Page number

Next

The search, filters and sorting should work correctly with pagination.

---

# 23. ADMIN RESPONSIVENESS

The admin dashboard must work beautifully on:

* Desktop
* Laptop
* Tablet
* Mobile

On desktop:

* Sidebar or clean top navigation is acceptable.

On mobile:

* Use a compact header.
* Cards should stack vertically.
* Tables should transform into readable cards where appropriate.
* Filters should stack cleanly.
* PDF buttons should remain easily accessible.

---

# 24. ERROR HANDLING

Handle all major errors gracefully.

Examples:

Database unavailable:

**Something went wrong while loading responses. Please try again.**

Submission failed:

**We couldn't submit your response. Please check your details and try again.**

Login failed:

**Invalid email or password.**

PDF generation failed:

**Unable to generate the PDF right now. Please try again.**

Never expose raw database/server errors to users.

---

# 25. TOAST NOTIFICATIONS

Use clean toast notifications for:

* Successful form submission
* Login success
* Logout
* Response deletion if deletion is later added
* PDF generation
* Export completion
* Errors

Keep notifications subtle and professional.

---

# 26. ACCESSIBILITY

Follow good accessibility practices.

Requirements:

* Proper labels for every input.
* Keyboard navigation.
* Visible focus states.
* Sufficient text contrast.
* Buttons must have clear labels.
* Modals must be keyboard accessible.
* Escape key should close modals where appropriate.
* Do not rely solely on colour to communicate status.

---

# 27. PERFORMANCE

Optimize the application for QR-code users.

The public page should:

* Load quickly.
* Be lightweight.
* Work well on mobile networks.
* Avoid unnecessary large assets.
* Avoid excessive animations.

The QR landing page should be immediately usable.

---

# 28. QR CODE COMPATIBILITY

The public page URL must be stable and suitable for encoding into a QR code.

Use:

`/`

as the public landing page.

Do not require login or any special parameter for public users.

The QR code will simply direct users to the SACE public form.

---

# 29. ROUTING

Implement:

`/`
→ Public SACE form

`/admin`
→ Protected admin dashboard

Admin route must redirect unauthenticated users to the admin login.

However, the login UI should normally be triggered through the hidden 5-click logo interaction from the public page.

---

# 30. LOGOUT

Admin dashboard must have a logout button.

After logout:

* Destroy/clear the authenticated session.
* Redirect to the public page.
* Attempting to revisit `/admin` must require authentication again.

---

# 31. UI DETAILS FOR PUBLIC PAGE

Build the public page roughly in this hierarchy:

SACE LOGO

SACE TAGLINE

---

### What are you looking for?

[ Select an option ▼ ]

---

After selection:

### Tell us about yourself

Name
[________________]

Phone Number (WhatsApp)
[________________]

Email
[________________]

College
[________________]

[ Submit Response ]

---

After successful submission:

✓

### Thank You!

Your response has been successfully submitted to SACE.

We will get in touch with you shortly.

[ Submit Another Response ]

Make the form feel premium and trustworthy.

---

# 32. ADMIN UI STRUCTURE

Admin dashboard layout:

### Header

SACE logo
Response Management Dashboard
Admin account
Logout

### Statistics

[ Total Responses ]
[ Internship ]
[ Immersion ]
[ Colleges ]

### Controls

[ Search responses... ]

[ Program ▼ ]

[ College ▼ ]

[ From Date ]

[ To Date ]

[ Newest First ▼ ]

[ Refresh ]

[ Download All Responses ]

### Responses

Response table/cards

Each row:

Date
Name
College
Program
Contact
[View] [PDF]

---

# 33. DATABASE DESIGN

Use a clean schema.

Example:

`responses`

```text
id
program_type
name
phone_whatsapp
email
college
submitted_at
updated_at
```

Use UUID for IDs.

Use timestamps in UTC in the database and display them appropriately in the UI.

---

# 34. DATA INTEGRITY

Do not allow accidental duplicate submissions caused by double-clicking the Submit button.

At minimum:

* Disable submit while processing.
* Generate a unique submission ID.
* Store each legitimate submission separately.

Do not silently overwrite another student's response.

---

# 35. ADMIN SECURITY

Implement authentication and authorization correctly.

Only the authorised SACE administrator should be able to:

* View responses.
* Search responses.
* Filter responses.
* View individual details.
* Download PDFs.
* Export responses.

Do not rely on:

`if (email === "admin@sace.com")`

in frontend code as the only security mechanism.

Use backend authentication and database access policies.

---

# 36. FUTURE-READY ARCHITECTURE

Build the application in a way that can later support additional programs.

For example, program types should not be hard-coded into database architecture in a way that makes future additions difficult.

Currently only show:

* Internship Program
* Immersion Program

But structure the code so another program can easily be added later.

---

# 37. COMPONENT STRUCTURE

Use reusable components where appropriate.

Suggested components:

* SaceLogo
* PublicHeader
* ProgramSelector
* StudentResponseForm
* SuccessScreen
* AdminLoginModal
* AdminDashboard
* DashboardStats
* ResponseFilters
* ResponseTable
* ResponseCard
* ResponseDetailsModal
* PdfExportButton
* ExportAllButton
* LoadingState
* EmptyState
* ErrorState

Keep the code clean and maintainable.

---

# 38. IMPORTANT DESIGN RULE

Do NOT make the application look like a generic CRUD admin template.

The public page should feel like a polished **SACE student engagement/registration experience**.

The admin side should feel like a professional internal SACE management system.

Use consistent branding, spacing, typography, cards and visual hierarchy.

---

# 39. DEMO DATA

For development/testing, create a few realistic sample responses if necessary.

Example:

Internship Program

* Rahul Sharma
* 9876543210
* [rahul@example.com](mailto:rahul@example.com)
* ABC College

Immersion Program

* Priya Patel
* 9876543211
* [priya@example.com](mailto:priya@example.com)
* XYZ University

Clearly distinguish seed/demo data from actual submissions and make it easy to remove before production.

---

# 40. FINAL REQUIREMENT

Build the application end-to-end.

Do not only create the UI.

The final implementation must include:

* Public QR landing page
* SACE branding
* Program dropdown
* Student response form
* Form validation
* Database storage
* Hidden 5-click logo admin access
* Secure admin authentication
* Admin dashboard
* Total response statistics
* Internship count
* Immersion count
* College count
* Search
* College filtering
* Program filtering
* Date filtering
* Date sorting
* Individual response view
* Individual PDF download
* Download/export all responses
* Responsive mobile design
* Desktop admin interface
* Loading states
* Error states
* Empty states
* Logout
* Database security / RLS
* Clean production-ready code

Before considering the build complete, test the entire flow:

**QR/public page → select program → fill form → submit → database → admin login → dashboard → search/filter/sort → view response → download individual PDF → download all responses → logout.**

Make sure every part of this flow actually works rather than being a visual placeholder.

the uploaded image is our logo and the colours codes are as follow : the color codes of SACE - #520380 & #FFB025 make the platform with this colours codes only

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sace-connect-portal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/db8126ff-0233-45d2-9153-9fea4c85e41c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
