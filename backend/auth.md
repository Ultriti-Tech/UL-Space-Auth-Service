-- =========================================================
-- ULTRITI AUTH SERVICE DATABASE
-- PostgreSQL Schema
-- =========================================================

select * from users;
select * from roles;
select * from permissions;
select * from role_permissions;
select * from user_roles;


-- 2ea0088f-2720-4bec-b7b5-15ac6c40bbf6



-- role id fetching -> 
-- select * from role_permissions 
-- where permission_id = '2ea0088f-2720-4bec-b7b5-15ac6c40bbf6'

-- -- view the role 
-- select * from roles
-- where id = 'e90ec3d3-d46e-45c0-b489-5680da8c6545'

-- UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================
-- 1. USERS
-- =========================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    profile_picture TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dusxzq0ws/image/upload/v1778653612/user_ea010y.png',

    profile_id TEXT NOT NULL DEFAULT 'user_ea010y',
	
    password_hash TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',

    email_verified BOOLEAN NOT NULL DEFAULT FALSE,

    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_status_check
        CHECK (status IN (
            'ACTIVE',
            'INACTIVE',
            'SUSPENDED'
        ))
);


-- =========================================================
-- 2. ROLES
-- =========================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(50) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. PERMISSIONS
-- =========================================================

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 4. USER ROLES
-- Many users <-> many roles
-- =========================================================

CREATE TABLE user_roles (
    user_id UUID NOT NULL,

    role_id UUID NOT NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 5. ROLE PERMISSIONS
-- Many roles <-> many permissions
-- =========================================================

CREATE TABLE role_permissions (
    role_id UUID NOT NULL,

    permission_id UUID NOT NULL,

    PRIMARY KEY (role_id, permission_id),

    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id)
        REFERENCES permissions(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 6. REFRESH TOKENS
-- Store HASH of refresh token, never the raw token
-- =========================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 7. PASSWORD RESET TOKENS
-- =========================================================

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    used_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 8. EMAIL VERIFICATION TOKENS
-- =========================================================

CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    token_hash TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_email_verification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_users_status
    ON users(status);

CREATE INDEX idx_user_roles_user_id
    ON user_roles(user_id);

CREATE INDEX idx_user_roles_role_id
    ON user_roles(role_id);

CREATE INDEX idx_role_permissions_role_id
    ON role_permissions(role_id);

CREATE INDEX idx_role_permissions_permission_id
    ON role_permissions(permission_id);

CREATE INDEX idx_refresh_tokens_user_id
    ON refresh_tokens(user_id);

CREATE INDEX idx_refresh_tokens_expires_at
    ON refresh_tokens(expires_at);

CREATE INDEX idx_password_reset_user_id
    ON password_reset_tokens(user_id);

CREATE INDEX idx_email_verification_user_id
    ON email_verification_tokens(user_id);


-- =========================================================
-- DEFAULT ROLES
-- =========================================================

INSERT INTO roles (name, description)
VALUES
    ('ADMIN', 'Full system administrator'),
    ('HR', 'Human resources management'),
    ('MANAGER', 'Project and team manager'),
    ('EMPLOYEE', 'Regular company employee'),
    ('INTERN', 'Intern user');
	
INSERT INTO roles (name, description)
VALUES
    ('COADMIN', 'Full system administrator')


-- =========================================================
-- DEFAULT PERMISSIONS
-- =========================================================

INSERT INTO permissions (name, description)
VALUES

    -- Users
    ('users.read', 'View users'),
    ('users.create', 'Create users'),
    ('users.update', 'Update users'),
    ('users.delete', 'Delete users'),

    -- Roles
    ('roles.read', 'View roles'),
    ('roles.create', 'Create roles'),
    ('roles.update', 'Update roles'),
    ('roles.delete', 'Delete roles'),

    -- Projects
    ('projects.read', 'View projects'),
    ('projects.create', 'Create projects'),
    ('projects.update', 'Update projects'),
    ('projects.delete', 'Delete projects'),
    ('projects.manage', 'Manage projects'),

    -- Tasks
    ('tasks.read', 'View tasks'),
    ('tasks.create', 'Create tasks'),
    ('tasks.update', 'Update tasks'),
    ('tasks.delete', 'Delete tasks'),
    ('tasks.assign', 'Assign tasks'),

    -- LMS
    ('courses.read', 'View courses'),
    ('courses.create', 'Create courses'),
    ('courses.update', 'Update courses'),
    ('courses.delete', 'Delete courses'),
    ('courses.enroll', 'Enroll in courses'),
    ('courses.manage', 'Manage courses'),

    -- HR
    ('hr.read', 'View HR information'),
    ('hr.manage', 'Manage HR information'),
    ('candidates.read', 'View candidates'),
    ('candidates.create', 'Create candidates'),
    ('candidates.update', 'Update candidates'),
    ('offers.create', 'Create internship offers'),
    ('offers.send', 'Send internship offers'),

    -- Chat
    ('chat.read', 'Read messages'),
    ('chat.send', 'Send messages'),
    ('chat.manage', 'Manage chat');


-- =========================================================
-- ROLE PERMISSIONS
-- =========================================================

-- ADMIN gets every permission
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN';


-- HR permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
JOIN permissions p
    ON p.name IN (
        'users.read',
        'users.create',
        'users.update',
        'candidates.read',
        'candidates.create',
        'candidates.update',
        'offers.create',
        'offers.send',
        'hr.read',
        'hr.manage'
    )
WHERE r.name = 'HR';


-- MANAGER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
JOIN permissions p
    ON p.name IN (
        'users.read',
        'projects.read',
        'projects.create',
        'projects.update',
        'projects.manage',
        'tasks.read',
        'tasks.create',
        'tasks.update',
        'tasks.assign',
        'chat.read',
        'chat.send'
    )
WHERE r.name = 'MANAGER';


-- EMPLOYEE permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
JOIN permissions p
    ON p.name IN (
        'projects.read',
        'tasks.read',
        'tasks.update',
        'courses.read',
        'courses.enroll',
        'chat.read',
        'chat.send'
    )
WHERE r.name = 'EMPLOYEE';


-- INTERN permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM roles r
JOIN permissions p
    ON p.name IN (
        'projects.read',
        'tasks.read',
        'tasks.update',
        'courses.read',
        'courses.enroll',
        'chat.read',
        'chat.send'
    )
WHERE r.name = 'INTERN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT
    'e90ec3d3-d46e-45c0-b489-5680da8c6545',
    p.id
FROM permissions p
WHERE p.name IN (

    -- Users
    'users.read',
    'users.create',
    'users.update',

    -- HR / Recruitment
    'candidates.read',
    'candidates.create',
    'candidates.update',

    'applications.read',
    'applications.create',
    'applications.update',
    'applications.manage',

    'interviews.read',
    'interviews.create',
    'interviews.update',
    'interviews.cancel',
    'interviews.manage',

    'evaluations.read',
    'evaluations.create',
    'evaluations.update',

    'offers.read',
    'offers.create',
    'offers.update',
    'offers.send',
    'offers.cancel',

    'internships.read',
    'internships.create',
    'internships.update',
    'internships.manage',

    'hr.read',
    'hr.manage',

    -- Projects
    'projects.read',
    'projects.create',
    'projects.update',
    'projects.manage',

    -- Tasks
    'tasks.read',
    'tasks.create',
    'tasks.update',
    'tasks.assign',
    'tasks.manage',

    -- Courses
    'courses.read',
    'courses.create',
    'courses.update',
    'courses.manage',
    'courses.enroll',

    -- Chat
    'chat.read',
    'chat.send',

    -- Audit
    'audit.read'

);

-- ----------------------------------------
-- alter user table and add cloumn picture id n picture url
-- ----------------------------------------

ALTER TABLE users
ADD COLUMN profile_picture TEXT NOT NULL
DEFAULT 'https://res.cloudinary.com/dusxzq0ws/image/upload/v1778653612/user_ea010y.png',
ADD COLUMN profile_id TEXT NOT NULL
DEFAULT 'user_ea010y';
