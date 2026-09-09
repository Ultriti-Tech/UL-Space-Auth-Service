# Devquor Development — Company Ecosystem Folder Structure

## 1. Architecture Overview

The recommended architecture uses separate private repositories/services so employees only receive access to the applications they need.

```text
Devquor-Development/
│
├── auth-service
├── lms-service
├── project-management-service
├── hr-internship-service
├── chat-service
├── notification-service
├── api-gateway
├── shared-types
│
├── lms-web
├── project-management-web
├── hr-internship-web
└── admin-web
```

Each major application should be a separate private GitHub repository.

---

# 2. GitHub Organization and Teams

```text
Devquor-Development
│
├── Teams
│   ├── LMS-Team
│   ├── Project-Team
│   ├── HR-Team
│   ├── Chat-Team
│   ├── Platform-Team
│   └── DevOps-Team
│
└── Repositories
    ├── auth-service
    ├── lms-service
    ├── project-management-service
    ├── hr-internship-service
    ├── chat-service
    ├── notification-service
    ├── api-gateway
    ├── shared-types
    ├── lms-web
    ├── project-management-web
    ├── hr-internship-web
    └── admin-web
```

## Recommended repository permissions

### LMS-Team

```text
✓ lms-service
✓ lms-web
✓ shared-types (only if required)

✗ hr-internship-service
✗ project-management-service
✗ chat-service
```

### Project-Team

```text
✓ project-management-service
✓ project-management-web
✓ shared-types (only if required)

✗ hr-internship-service
✗ lms-service
✗ chat-service
```

### HR-Team

```text
✓ hr-internship-service
✓ hr-internship-web

✗ lms-service
✗ project-management-service
✗ chat-service
```

### Chat-Team

```text
✓ chat-service
✓ shared-types (only if required)

✗ hr-internship-service
✗ lms-service
```

### Platform-Team

```text
✓ auth-service
✓ api-gateway
✓ shared-types
```

### DevOps-Team

```text
✓ deployment/infrastructure repositories
✓ required service repositories
```

---

# 3. auth-service

Authentication and authorization service.

```text
auth-service/
│
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts
│   │
│   ├── services/
│   │   └── auth.service.ts
│   │
│   ├── routes/
│   │   └── auth.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── permission.middleware.ts
│   │
│   ├── validators/
│   │   └── auth.validator.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── utils/
│   │
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- Login
- Logout
- Registration
- Access tokens
- Refresh tokens
- Password reset
- Roles
- Permissions
- Authentication middleware

---

# 4. lms-service

Learning Management System backend.

```text
lms-service/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── courses/
│   │   │   ├── course.controller.ts
│   │   │   ├── course.service.ts
│   │   │   ├── course.routes.ts
│   │   │   └── course.validator.ts
│   │   │
│   │   ├── lessons/
│   │   ├── learning-paths/
│   │   ├── enrollments/
│   │   ├── assessments/
│   │   ├── quizzes/
│   │   ├── certificates/
│   │   ├── progress/
│   │   └── skills/
│   │
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- Courses
- Lessons
- Learning paths
- Employee enrollment
- Assessments
- Quizzes
- Progress tracking
- Certificates
- Skills
- Learning analytics

---

# 5. project-management-service

Separate project-management backend.

```text
project-management-service/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── projects/
│   │   ├── teams/
│   │   ├── clusters/
│   │   ├── tasks/
│   │   ├── subtasks/
│   │   ├── assignments/
│   │   ├── milestones/
│   │   ├── sprints/
│   │   ├── comments/
│   │   ├── attachments/
│   │   ├── time-tracking/
│   │   └── activity-logs/
│   │
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- Projects
- Teams
- Clusters
- Tasks
- Subtasks
- Employee assignments
- Milestones
- Sprints
- Comments
- Attachments
- Time tracking
- Activity history
- Workload management

---

# 6. hr-internship-service

HR, recruitment, internship and offer-letter backend.

```text
hr-internship-service/
│
├── src/
│   │
│   ├── modules/
│   │   │
│   │   ├── candidates/
│   │   ├── applications/
│   │   ├── interviews/
│   │   ├── internships/
│   │   ├── offers/
│   │   ├── onboarding/
│   │   └── employees/
│   │
│   ├── services/
│   │   ├── email/
│   │   ├── pdf/
│   │   └── storage/
│   │
│   ├── templates/
│   │   └── offer-letter/
│   │       └── internship-offer.html
│   │
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- Candidates
- Applications
- Interviews
- Internship offers
- Offer-letter PDF generation
- Email delivery
- Onboarding
- Employee records
- Offer verification
- Offer versions

---

# 7. chat-service

Independent real-time chat service.

```text
chat-service/
│
├── src/
│   │
│   ├── modules/
│   │   ├── conversations/
│   │   ├── messages/
│   │   ├── groups/
│   │   ├── clusters/
│   │   ├── reactions/
│   │   ├── attachments/
│   │   └── presence/
│   │
│   ├── socket/
│   │   ├── socket.server.ts
│   │   ├── chat.socket.ts
│   │   └── presence.socket.ts
│   │
│   ├── middleware/
│   ├── config/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- One-to-one chat
- Group chat
- Cluster chat
- Messages
- Reactions
- Typing indicators
- Online/offline presence
- Chat attachments

---

# 8. notification-service

Central notification service.

```text
notification-service/
│
├── src/
│   ├── modules/
│   │   ├── notifications/
│   │   ├── email/
│   │   ├── push/
│   │   └── templates/
│   │
│   ├── workers/
│   │   └── notification.worker.ts
│   │
│   ├── queues/
│   │   └── notification.queue.ts
│   │
│   ├── config/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── package.json
├── tsconfig.json
└── README.md
```

Responsibilities:

- Email notifications
- Push notifications
- In-app notifications
- Assignment notifications
- Course notifications
- Offer notifications
- Background notification jobs

---

# 9. api-gateway

Single entry point for frontend applications.

```text
api-gateway/
│
├── src/
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── lms.routes.ts
│   │   ├── project.routes.ts
│   │   ├── hr.routes.ts
│   │   └── chat.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── services/
│   │   └── service-client.ts
│   │
│   ├── config/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

Example:

```text
Frontend
   ↓
api.company.com
   ↓
API Gateway
   ├── Auth Service
   ├── LMS Service
   ├── HR Service
   ├── Project Service
   └── Chat Service
```

---

# 10. shared-types

Only genuinely shared TypeScript types should be placed here.

```text
shared-types/
│
├── src/
│   ├── auth/
│   │   └── auth.types.ts
│   │
│   ├── users/
│   │   └── user.types.ts
│   │
│   ├── projects/
│   │   └── project.types.ts
│   │
│   ├── api/
│   │   └── response.types.ts
│   │
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

Do not put business logic here.

---

# 11. lms-web

Frontend for the LMS.

```text
lms-web/
│
├── src/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Courses/
│   │   ├── Learning/
│   │   ├── Assessments/
│   │   ├── Certificates/
│   │   └── Profile/
│   │
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 12. project-management-web

Frontend for project management.

```text
project-management-web/
│
├── src/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Projects/
│   │   ├── Tasks/
│   │   ├── Teams/
│   │   ├── Clusters/
│   │   ├── Assignments/
│   │   ├── Milestones/
│   │   └── Reports/
│   │
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 13. hr-internship-web

HR and internship management frontend.

```text
hr-internship-web/
│
├── src/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Candidates/
│   │   ├── Applications/
│   │   ├── Interviews/
│   │   ├── Internships/
│   │   ├── Offers/
│   │   ├── Employees/
│   │   └── Onboarding/
│   │
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 14. admin-web

Central administration interface.

```text
admin-web/
│
├── src/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Users/
│   │   ├── Roles/
│   │   ├── Permissions/
│   │   ├── Departments/
│   │   ├── Services/
│   │   └── AuditLogs/
│   │
│   ├── components/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 15. Database Architecture

For stronger isolation, use separate databases/services rather than one giant database.

```text
PostgreSQL
│
├── auth_db
├── lms_db
├── project_management_db
├── hr_db
├── chat_db
└── notification_db
```

Each service owns its database.

```text
auth-service
    ↓
auth_db

lms-service
    ↓
lms_db

project-management-service
    ↓
project_management_db

hr-internship-service
    ↓
hr_db

chat-service
    ↓
chat_db

notification-service
    ↓
notification_db
```

Avoid allowing one service to directly query another service's database.

Use APIs/events between services.

---

# 16. Project Management Database

Core tables:

```text
users
departments
roles
permissions
user_roles

projects
project_members
project_roles

clusters
cluster_members

milestones

tasks
task_assignees
task_dependencies
task_subtasks

task_comments
task_attachments
task_labels
labels

sprints
sprint_tasks

time_entries

project_files

notifications

activity_logs
```

For the initial simple assignment system, the most important tables are:

```text
employees
work_assignments
```

Example:

```text
employees
----------
id
name
email
role
department_id
created_at
updated_at
```

```text
work_assignments
----------------
id
employee_id
title
description
role
start_date
duration
duration_unit
start_time
end_time
status
created_by
created_at
updated_at
```

---

# 17. Task Database

Recommended structure:

```text
tasks
-----
id
project_id
milestone_id
cluster_id
parent_task_id
title
description
status
priority
created_by
start_date
due_date
estimated_hours
actual_hours
created_at
updated_at
```

Assignments:

```text
task_assignees
--------------
task_id
user_id
assigned_by
assigned_at
```

Dependencies:

```text
task_dependencies
------------------
task_id
depends_on_task_id
dependency_type
```

Comments:

```text
task_comments
-------------
id
task_id
user_id
parent_comment_id
content
created_at
updated_at
```

Activity:

```text
activity_logs
-------------
id
project_id
task_id
user_id
action
old_value
new_value
created_at
```

---

# 18. HR Offer Letter Architecture

Offer creation workflow:

```text
HR
 ↓
Select Candidate
 ↓
Enter/confirm role
 ↓
Set start date
 ↓
Set duration
 ↓
Set stipend
 ↓
Set work mode
 ↓
Preview
 ↓
Generate PDF
 ↓
Store PDF
 ↓
Save offer metadata
 ↓
Send email
```

Offer template:

```text
templates/
└── offer-letter/
    └── internship-offer.html
```

Use placeholders:

```text
{{candidate_name}}
{{role}}
{{start_date}}
{{duration}}
{{stipend}}
{{work_mode}}
{{company_name}}
{{company_address}}
{{offer_date}}
{{offer_id}}
{{authorized_person}}
{{designation}}
```

Offer table:

```text
internship_offers
-----------------
id
candidate_id
offer_number
role
start_date
end_date
duration
stipend
work_mode
status
pdf_url
issued_at
created_at
updated_at
```

For versions:

```text
offer_versions
--------------
id
offer_id
version
pdf_url
created_by
created_at
```

---

# 19. Offer Status

Recommended statuses:

```text
DRAFT
   ↓
GENERATED
   ↓
SENT
   ↓
VIEWED
   ↓
ACCEPTED
```

Other states:

```text
REJECTED
EXPIRED
WITHDRAWN
```

---

# 20. Email Architecture

For a simple first version:

```text
HR Application
      ↓
Create Offer
      ↓
Generate PDF
      ↓
Email Service
      ↓
Candidate
```

For production scale:

```text
HR Service
      ↓
Notification Queue
      ↓
Redis / BullMQ
      ↓
Notification Worker
      ↓
Email Provider
      ↓
Candidate
```

---

# 21. Project Assignment Email

Manager enters:

```text
Employee Name
Email
Role
Task
Start Date
Duration
Time
Description
```

Then:

```text
Create Assignment
       ↓
Save PostgreSQL
       ↓
Queue Email
       ↓
Send Email
       ↓
Employee
```

Employee receives:

```text
Subject:
New Work Assignment – Backend Developer

Hello Rahul,

You have been assigned a new work assignment.

Work:
Implement Login API

Role:
Backend Developer

Start Date:
5 September 2026

Duration:
5 Days

Working Time:
10:00 AM – 5:00 PM

Please log in to the company portal to view
the complete assignment and update your progress.

Regards,
Company Team
```

---

# 22. Overall Service Communication

```text
                         API GATEWAY
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
         AUTH SERVICE      LMS SERVICE      HR SERVICE
             │                │                │
             ▼                ▼                ▼
          AUTH DB           LMS DB           HR DB

             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
       PROJECT SERVICE    CHAT SERVICE    NOTIFICATION
             │                │                │
             ▼                ▼                ▼
        PROJECT DB          CHAT DB       NOTIFICATION DB
```

---

# 23. Security Boundary

Do not rely only on frontend hiding.

Use:

```text
Frontend permission checks
        +
API authorization
        +
Repository permissions
        +
Database isolation
```

For example:

```text
HR Employee
   ↓
HR Web
   ↓
API Gateway
   ↓
HR Service
   ↓
HR Database
```

A Project Management employee should not automatically have access to the HR repository or HR database.

---

# 24. Recommended Technology Stack

## Frontend

```text
React
TypeScript
Vite
React Router
TanStack Query
Zustand or Redux Toolkit
Tailwind CSS
```

## Backend

```text
Node.js
Express
TypeScript
Prisma
PostgreSQL
Zod
JWT
bcrypt
Socket.IO
Redis
BullMQ
```

## Infrastructure

```text
Docker
GitHub Actions
Nginx / Load Balancer
Cloud deployment
Object storage for files
```

## Communication

```text
REST APIs
WebSockets
Internal service APIs
Events/queues where appropriate
```

---

# 25. Recommended Development Order

Do not build every service simultaneously.

### Phase 1 — Foundation

```text
auth-service
api-gateway
shared-types
```

### Phase 2 — HR

```text
hr-internship-service
hr-internship-web

Candidate
Application
Interview
Internship
Offer Letter
PDF
Email
```

### Phase 3 — Project Management

```text
project-management-service
project-management-web

Projects
Teams
Clusters
Tasks
Assignments
Milestones
Comments
Activity Logs
```

### Phase 4 — LMS

```text
lms-service
lms-web

Courses
Lessons
Learning Paths
Assessments
Progress
Certificates
Skills
```

### Phase 5 — Chat

```text
chat-service

1-to-1 Chat
Groups
Clusters
Presence
Typing
Attachments
```

### Phase 6 — Notifications

```text
notification-service

Email
Push
In-app Notifications
Queues
Workers
```

---

# 26. Final Repository Structure

```text
Devquor-Development/
│
├── auth-service/
│
├── lms-service/
│
├── project-management-service/
│
├── hr-internship-service/
│
├── chat-service/
│
├── notification-service/
│
├── api-gateway/
│
├── shared-types/
│
├── lms-web/
│
├── project-management-web/
│
├── hr-internship-web/
│
└── admin-web/
```

This structure gives you:

- Separate teams
- Separate repositories
- Limited source-code access
- Independent deployments
- Clear ownership
- Easier maintenance
- Database isolation
- Independent scaling
- Better security boundaries
- Ability to grow into a larger company platform

## Core principle

```text
One giant application
        ↓
Avoid

Separate bounded services
        ↓
Separate repositories
        ↓
Separate teams
        ↓
Controlled access
        ↓
APIs/events between services
        ↓
Scalable company ecosystem
```
