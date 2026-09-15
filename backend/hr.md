-- -- ul_Space_HR
-- SELECT * FROM candidates;
-- SELECT * FROM applications;
-- SELECT * FROM interviews;



-- -- ---------------------------------
-- CREATE TABLE candidates (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

--     user_id UUID UNIQUE,
--     candidate_code VARCHAR(30) UNIQUE NOT NULL,

--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
-- 	resume_url TEXT NOT NULL,

--     email VARCHAR(255) NOT NULL UNIQUE,
--     phone VARCHAR(20),

--     city VARCHAR(100),
--     state VARCHAR(100),
--     country VARCHAR(100) DEFAULT 'India',

--     college_name VARCHAR(255),
--     degree VARCHAR(150),
--     specialization VARCHAR(150),
--     graduation_year INTEGER,

--     experience_level VARCHAR(50),

--     linkedin_url TEXT,
--     github_url TEXT,
--     portfolio_url TEXT,

--     bio TEXT,

--     profile_status VARCHAR(50) DEFAULT 'ACTIVE',

--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- -- \application 
-- CREATE TABLE applications (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

--     application_code VARCHAR(30) UNIQUE NOT NULL,

--     candidate_id UUID NOT NULL,

--     role VARCHAR(150) NOT NULL,

--     department VARCHAR(150),

--     application_type VARCHAR(50),
--     -- INTERNSHIP / FULL_TIME / PART_TIME

--     duration_months INTEGER,

--     work_mode VARCHAR(50),
--     -- REMOTE / OFFICE / HYBRID

--     status VARCHAR(50) DEFAULT 'APPLIED',
--     -- APPLIED / SHORTLISTED / INTERVIEW / SELECTED / REJECTED / WITHDRAWN

--     source VARCHAR(100),

--     cover_letter TEXT,

--     recruiter_notes TEXT,

--     applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_applications_candidate
--         FOREIGN KEY (candidate_id)
--         REFERENCES candidates(id)
--         ON DELETE CASCADE
-- );

-- -- interview 

-- -- interview 
-- CREATE TABLE interviews (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

--     application_id UUID NOT NULL,

--     round_number INT NOT NULL,
--     interview_type VARCHAR(30) NOT NULL,

--     title VARCHAR(150),
--     description TEXT,

--     scheduled_at TIMESTAMPTZ NOT NULL,
--     duration_minutes INT DEFAULT 30,

--     mode VARCHAR(20) NOT NULL DEFAULT 'ONLINE',

--     location TEXT,
--     meeting_link TEXT,

--     status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',

--     created_by UUID NOT NULL,

--     created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT interview_type_check
--         CHECK (
--             interview_type IN (
--                 'HR',
--                 'TECHNICAL',
--                 'MANAGERIAL',
--                 'FINAL',
--                 'SCREENING',
--                 'OTHER'
--             )
--         ),

--     CONSTRAINT interview_mode_check
--         CHECK (
--             mode IN (
--                 'ONLINE',
--                 'OFFLINE',
--                 'PHONE'
--             )
--         ),

--     CONSTRAINT interview_status_check
--         CHECK (
--             status IN (
--                 'SCHEDULED',
--                 'IN_PROGRESS',
--                 'COMPLETED',
--                 'CANCELLED',
--                 'RESCHEDULED',
--                 'NO_SHOW'
--             )
--         ),

--     CONSTRAINT interview_round_check
--         CHECK (round_number > 0),

--     CONSTRAINT interview_duration_check
--         CHECK (duration_minutes > 0)
-- );

-- -- interview_panel
-- CREATE TABLE interview_panel (
--     interview_id UUID NOT NULL,
--     interviewer_id UUID NOT NULL,

--     role VARCHAR(30),

--     joined_at TIMESTAMPTZ,
--     feedback_submitted BOOLEAN NOT NULL DEFAULT FALSE,

--     PRIMARY KEY (interview_id, interviewer_id),

--     CONSTRAINT fk_interview_panel_interview
--         FOREIGN KEY (interview_id)
--         REFERENCES interviews(id)
--         ON DELETE CASCADE
-- );

-- -- interview evaluation 
-- CREATE TABLE interview_evaluations (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

--     interview_id UUID NOT NULL,
--     interviewer_id UUID NOT NULL,

--     technical_score NUMERIC(5,2),
--     communication_score NUMERIC(5,2),
--     problem_solving_score NUMERIC(5,2),

--     overall_score NUMERIC(5,2),

--     strengths TEXT,
--     weaknesses TEXT,
--     feedback TEXT,

--     recommendation VARCHAR(30),

--     submitted_at TIMESTAMPTZ,

--     created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_evaluation_interview
--         FOREIGN KEY (interview_id)
--         REFERENCES interviews(id)
--         ON DELETE CASCADE,

--     CONSTRAINT evaluation_recommendation_check
--         CHECK (
--             recommendation IN (
--                 'SELECT',
--                 'REJECT',
--                 'HOLD',
--                 'NEXT_ROUND'
--             )
--             OR recommendation IS NULL
--         ),

--     CONSTRAINT technical_score_check
--         CHECK (
--             technical_score >= 0
--             AND technical_score <= 10
--             OR technical_score IS NULL
--         ),

--     CONSTRAINT communication_score_check
--         CHECK (
--             communication_score >= 0
--             AND communication_score <= 10
--             OR communication_score IS NULL
--         ),

--     CONSTRAINT problem_solving_score_check
--         CHECK (
--             problem_solving_score >= 0
--             AND problem_solving_score <= 10
--             OR problem_solving_score IS NULL
--         ),

--     CONSTRAINT overall_score_check
--         CHECK (
--             overall_score >= 0
--             AND overall_score <= 10
--             OR overall_score IS NULL
--         )
-- );
	


select * from applications where application_code = 'APC-481009';
update applications
set status = 'SHORTLISTED'
WHERE application_code = 'APC-308821'

delete from applications
where candidate_id = 'deb637c9-6a50-4cfb-ad45-ddd21f9c1e05'
-- -- delete from applications
-- -- where application_code = 'APC-917463'

-- -- ALTER TABLE 
-- -- ALTER TABLE candidates 
-- -- ADD COLUMN resume_url TEXT NOT NULL

-- -- D

-- -- -- DELETE TABLES 
-- -- TRUNCATE TABLE candidates CASCADE;
-- -- -- TRUNCATE TABLE candidates;
-- -- TRUNCATE TABLE applications;



-- =========================================================
-- UL_SPACE_HR
-- HR / Recruitment Database
-- PostgreSQL / Neon
-- =========================================================


SELECT * FROM interviews;


-- =========================================================
-- 1. CANDIDATES
-- =========================================================

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID UNIQUE,
    candidate_code VARCHAR(30) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    resume_url TEXT NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),

    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',

    college_name VARCHAR(255),
    degree VARCHAR(150),
    specialization VARCHAR(150),
    graduation_year INTEGER,

    experience_level VARCHAR(50),

    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,

    bio TEXT,

    profile_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. APPLICATIONS
-- =========================================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_code VARCHAR(30) UNIQUE NOT NULL,

    candidate_id UUID NOT NULL,

    role VARCHAR(150) NOT NULL,
    department VARCHAR(150),

    application_type VARCHAR(50),

    duration_months INTEGER,

    work_mode VARCHAR(50),

    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',

    source VARCHAR(100),

    cover_letter TEXT,

    recruiter_notes TEXT,

    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_applications_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,

    CONSTRAINT application_type_check
        CHECK (
            application_type IN (
                'INTERNSHIP',
                'FULL_TIME',
                'PART_TIME'
            )
            OR application_type IS NULL
        ),

    CONSTRAINT application_duration_check
        CHECK (
            duration_months > 0
            OR duration_months IS NULL
        ),

    CONSTRAINT application_work_mode_check
        CHECK (
            work_mode IN (
                'REMOTE',
                'OFFICE',
                'HYBRID'
            )
            OR work_mode IS NULL
        ),

    CONSTRAINT application_status_check
        CHECK (
            status IN (
                'APPLIED',
                'SHORTLISTED',
                'INTERVIEW',
                'SELECTED',
                'REJECTED',
                'WITHDRAWN'
            )
        )
);


-- =========================================================
-- 3. INTERVIEWS
-- =========================================================

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    application_id UUID NOT NULL,

    round_number INT NOT NULL,
    interview_type VARCHAR(30) NOT NULL,

    title VARCHAR(150),
    description TEXT,

    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,

    mode VARCHAR(20) NOT NULL DEFAULT 'ONLINE',

    location TEXT,
    meeting_link TEXT,

    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',

    created_by UUID NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,


    -- -----------------------------------------------------
    -- Foreign Key
    -- -----------------------------------------------------

    CONSTRAINT fk_interviews_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE,


    -- -----------------------------------------------------
    -- Interview Type
    -- -----------------------------------------------------

    CONSTRAINT interview_type_check
        CHECK (
            interview_type IN (
                'HR',
        'TECHNICAL',
        'MANAGERIAL',
        'FINAL',
        'SCREENING',
        'TEST',
        'ASSESSMENT',
        'OTHER'
            )
        ),


    -- -----------------------------------------------------
    -- Interview Mode
    -- -----------------------------------------------------

    CONSTRAINT interview_mode_check
        CHECK (
            mode IN (
                'ONLINE',
                'OFFLINE',
                'PHONE'
            )
        ),


    -- -----------------------------------------------------
    -- Interview Status
    -- -----------------------------------------------------

    CONSTRAINT interview_status_check
        CHECK (
            status IN (
                'SCHEDULED',
                'IN_PROGRESS',
                'COMPLETED',
                'VERIFIED',
                'CANCELLED',
                'RESCHEDULED',
                'NO_SHOW'
            )
        ),


    -- -----------------------------------------------------
    -- Round
    -- -----------------------------------------------------

    CONSTRAINT interview_round_check
        CHECK (round_number > 0),


    -- -----------------------------------------------------
    -- Duration
    -- -----------------------------------------------------

    CONSTRAINT interview_duration_check
        CHECK (duration_minutes > 0)
);


-- =========================================================
-- 4. INTERVIEW PANEL
-- =========================================================

CREATE TABLE interview_panel (
    interview_id UUID NOT NULL,
    interviewer_id UUID NOT NULL,

    role VARCHAR(30),

    joined_at TIMESTAMPTZ,
    feedback_submitted BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (interview_id, interviewer_id),

    CONSTRAINT fk_interview_panel_interview
        FOREIGN KEY (interview_id)
        REFERENCES interviews(id)
        ON DELETE CASCADE
);


-- =========================================================
-- 5. INTERVIEW EVALUATIONS
-- =========================================================

CREATE TABLE interview_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    interview_id UUID NOT NULL,
    interviewer_id UUID NOT NULL,

    technical_score NUMERIC(5,2),
    communication_score NUMERIC(5,2),
    problem_solving_score NUMERIC(5,2),

    overall_score NUMERIC(5,2),

    strengths TEXT,
    weaknesses TEXT,
    feedback TEXT,

    recommendation VARCHAR(30),

    submitted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,


    -- -----------------------------------------------------
    -- Foreign Key
    -- -----------------------------------------------------

    CONSTRAINT fk_evaluation_interview
        FOREIGN KEY (interview_id)
        REFERENCES interviews(id)
        ON DELETE CASCADE,


    -- -----------------------------------------------------
    -- Prevent duplicate evaluation
    -- -----------------------------------------------------

    CONSTRAINT unique_interviewer_evaluation
        UNIQUE (interview_id, interviewer_id),


    -- -----------------------------------------------------
    -- Recommendation
    -- -----------------------------------------------------

    CONSTRAINT evaluation_recommendation_check
        CHECK (
            recommendation IN (
                'SELECT',
                'REJECT',
                'HOLD',
                'NEXT_ROUND'
            )
            OR recommendation IS NULL
        ),


    -- -----------------------------------------------------
    -- Technical Score
    -- -----------------------------------------------------

    CONSTRAINT technical_score_check
        CHECK (
            technical_score >= 0
            AND technical_score <= 10
            OR technical_score IS NULL
        ),


    -- -----------------------------------------------------
    -- Communication Score
    -- -----------------------------------------------------

    CONSTRAINT communication_score_check
        CHECK (
            communication_score >= 0
            AND communication_score <= 10
            OR communication_score IS NULL
        ),


    -- -----------------------------------------------------
    -- Problem Solving Score
    -- -----------------------------------------------------

    CONSTRAINT problem_solving_score_check
        CHECK (
            problem_solving_score >= 0
            AND problem_solving_score <= 10
            OR problem_solving_score IS NULL
        ),


    -- -----------------------------------------------------
    -- Overall Score
    -- -----------------------------------------------------

    CONSTRAINT overall_score_check
        CHECK (
            overall_score >= 0
            AND overall_score <= 10
            OR overall_score IS NULL
        )
);


-- ------------------------------------
-- qualified candidates
CREATE TABLE qualified_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    candidate_id UUID NOT NULL,
    application_id UUID NOT NULL,
    interview_id UUID NOT NULL,
	status VARCHAR(30) NOT NULL DEFAULT 'NON VERIFIED',

    CONSTRAINT fk_qualified_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES candidates(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_qualified_application
        FOREIGN KEY (application_id)
        REFERENCES applications(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_qualified_interview
        FOREIGN KEY (interview_id)
        REFERENCES interviews(id)
        ON DELETE CASCADE
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_candidates_email
    ON candidates(email);

CREATE INDEX idx_candidates_candidate_code
    ON candidates(candidate_code);

CREATE INDEX idx_applications_candidate_id
    ON applications(candidate_id);

CREATE INDEX idx_applications_status
    ON applications(status);

CREATE INDEX idx_applications_role
    ON applications(role);

CREATE INDEX idx_interviews_application_id
    ON interviews(application_id);

CREATE INDEX idx_interviews_scheduled_at
    ON interviews(scheduled_at);

CREATE INDEX idx_interviews_status
    ON interviews(status);

CREATE INDEX idx_interview_panel_interviewer_id
    ON interview_panel(interviewer_id);

CREATE INDEX idx_evaluations_interview_id
    ON interview_evaluations(interview_id);

CREATE INDEX idx_evaluations_interviewer_id
    ON interview_evaluations(interviewer_id);


	


select * from interview_panel;
select * from interviews;
select * from applications


where application_code = 'APC-400083'

update applications
set status = 'SHORTLISTED'
where application_code = 'APC-400083'

delete from applications
where application_code = 'APC-400083'

delete from  interviews
where application_id = 'd2b649e0-b095-4404-b36b-ea9de6d97fd2'



select * from interviews
where interview_type = 'TECHNICAL' and round_number = 2

UPDATE interviews
SET round_number = 2
WHERE interview_type = 'TECHNICAL'
  AND round_number = 1;


-- chnaged  in neon ----
=================================
ALTER TABLE interviews
DROP CONSTRAINT interview_type_check;

ALTER TABLE interviews
ADD CONSTRAINT interview_type_check
CHECK (
    interview_type IN (
        'HR',
        'TECHNICAL',
        'MANAGERIAL',
        'FINAL',
        'SCREENING',
        'TEST',
        'ASSESSMENT',
        'OTHER'
    )
);


------ have to chnage 


ALTER TABLE interviews
DROP CONSTRAINT interview_status_check;

ALTER TABLE interviews
ADD CONSTRAINT interview_status_check
CHECK (
    status IN (
        'SCHEDULED',
        'IN_PROGRESS',
        'COMPLETED',
        'VERIFIED',
        'CANCELLED',
        'RESCHEDULED',
        'NO_SHOW'
    )
);

ALTER TABLE qualified_candidates
ADD CONSTRAINT qualified_candidates_status_check
CHECK (
    status IN (
        'NON_VERIFIED',
        'IN_PROGRESS',
        'VERIFIED',
        'CANCELLED'
    )
);


-- 
-- ALTER TABLE qualified_candidates
-- DROP COLUMN status;

SELECT * FROM qualified_candidates;

ALTER TABLE qualified_candidates
ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'NON_VERIFIED';

