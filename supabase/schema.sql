-- ==========================================================
-- AFUED/ACT ASSESS - Supabase PostgreSQL Database Foundation
-- Adeyemi Federal University of Education, Ondo City
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. INSTITUTIONS
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    location VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FACULTIES
CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    dean_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(institution_id, code)
);

-- 3. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    hod_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(faculty_id, code)
);

-- 4. PROGRAMMES
CREATE TABLE IF NOT EXISTS public.programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    duration_years INT NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACADEMIC SESSIONS & SEMESTERS
CREATE TABLE IF NOT EXISTS public.academic_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(50) NOT NULL UNIQUE, -- e.g. '2024/2025'
    is_current BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    semester_name VARCHAR(20) NOT NULL, -- 'FIRST', 'SECOND'
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, semester_name)
);

-- 6. LEVELS
CREATE TABLE IF NOT EXISTS public.levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_code VARCHAR(10) NOT NULL UNIQUE, -- '100', '200', '300', '400', '500'
    level_name VARCHAR(50) NOT NULL
);

-- 7. BASE PROFILES (Linked to auth.users)
CREATE TYPE user_role_enum AS ENUM (
    'SUPER_ADMIN',
    'INSTITUTION_ADMIN',
    'LECTURER',
    'EXAMINATION_OFFICER',
    'COURSE_REP',
    'STUDENT'
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    avatar_url TEXT,
    institution_id UUID REFERENCES public.institutions(id),
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id VARCHAR(100) NOT NULL UNIQUE, -- Matriculation Number
    institution_id UUID REFERENCES public.institutions(id),
    faculty_id UUID REFERENCES public.faculties(id) NOT NULL,
    department_id UUID REFERENCES public.departments(id) NOT NULL,
    programme_id UUID REFERENCES public.programmes(id) NOT NULL,
    level_id UUID REFERENCES public.levels(id),
    academic_session_id UUID REFERENCES public.academic_sessions(id),
    level_code VARCHAR(10) NOT NULL,
    academic_session VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. LECTURERS TABLE
CREATE TABLE IF NOT EXISTS public.lecturers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_id VARCHAR(100) NOT NULL UNIQUE,
    faculty_id UUID REFERENCES public.faculties(id) NOT NULL,
    department_id UUID REFERENCES public.departments(id) NOT NULL,
    title VARCHAR(50) DEFAULT 'Dr.',
    office_location VARCHAR(255),
    academic_session VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. COURSE REPS TABLE
CREATE TABLE IF NOT EXISTS public.course_reps (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id VARCHAR(100) NOT NULL,
    faculty_id UUID REFERENCES public.faculties(id) NOT NULL,
    department_id UUID REFERENCES public.departments(id) NOT NULL,
    programme_id UUID REFERENCES public.programmes(id) NOT NULL,
    level_code VARCHAR(10) NOT NULL,
    assigned_course_code VARCHAR(50),
    academic_session VARCHAR(50) NOT NULL,
    approval_status VARCHAR(20) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES public.profiles(id),
    approval_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EXAMINATION OFFICERS TABLE
CREATE TABLE IF NOT EXISTS public.examination_officers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_id VARCHAR(100) NOT NULL UNIQUE,
    faculty_id UUID REFERENCES public.faculties(id) NOT NULL,
    designation VARCHAR(100) DEFAULT 'Faculty Examination Officer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_id VARCHAR(100) NOT NULL UNIQUE,
    access_level VARCHAR(50) DEFAULT 'INSTITUTIONAL' CHECK (access_level IN ('FULL_SYSTEM', 'INSTITUTIONAL')),
    department_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    credit_units INT NOT NULL DEFAULT 3,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    level_code VARCHAR(10) NOT NULL,
    semester VARCHAR(20) NOT NULL CHECK (semester IN ('FIRST', 'SECOND')),
    lecturer_id UUID REFERENCES public.lecturers(id),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ASSESSMENTS
CREATE TYPE assessment_type_enum AS ENUM (
    'CONTINUOUS_ASSESSMENT',
    'TEST',
    'MID_SEMESTER_TEST',
    'EXAMINATION'
);

CREATE TYPE assessment_status_enum AS ENUM (
    'SCHEDULED',
    'ACTIVE',
    'COMPLETED',
    'MARKING',
    'RESULTS_PUBLISHED',
    'CANCELLED'
);

CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    type assessment_type_enum NOT NULL DEFAULT 'CONTINUOUS_ASSESSMENT',
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    total_marks INT NOT NULL DEFAULT 30,
    total_questions INT NOT NULL DEFAULT 30,
    status assessment_status_enum NOT NULL DEFAULT 'SCHEDULED',
    academic_session VARCHAR(50) NOT NULL,
    semester VARCHAR(20) NOT NULL,
    lecturer_id UUID REFERENCES public.lecturers(id),
    instructions TEXT,
    venue_or_platform VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(50) DEFAULT 'ALL',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'ASSESSMENT', 'SCHEDULE', 'RESULT', 'ANNOUNCEMENT', 'PROFILE'
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_record VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    ip_address VARCHAR(100),
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Designed for standard Supabase Publishable / Anon Key + Authenticated Users
-- Browser client operations use publishable anon key with RLS enforcement
-- ==========================================================
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examination_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Reference Data: Public read for student registration & hierarchy browsing
CREATE POLICY "Public read institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Public read faculties" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public read programmes" ON public.programmes FOR SELECT USING (true);
CREATE POLICY "Public read academic_sessions" ON public.academic_sessions FOR SELECT USING (true);
CREATE POLICY "Public read semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public read levels" ON public.levels FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);

-- 2. Profiles: Users can insert/view/update their own profile; admins can view all
CREATE POLICY "Users view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN')
    ));

CREATE POLICY "Users insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. Students: Students insert & manage own student record; staff can view
CREATE POLICY "Students view self or authorized staff" ON public.students
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER'))
    );

CREATE POLICY "Students insert own record" ON public.students
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Students update own record" ON public.students
    FOR UPDATE USING (auth.uid() = id);

-- 4. Lecturers: Lecturers manage own record; admins manage all
CREATE POLICY "Lecturers view self or admin" ON public.lecturers
    FOR SELECT USING (
        auth.uid() = id OR 
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN'))
    );

CREATE POLICY "Lecturers insert own record" ON public.lecturers
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Lecturers update own record" ON public.lecturers
    FOR UPDATE USING (auth.uid() = id);

-- 5. Course Reps: Transparent departmental coordination; admins manage clearances
CREATE POLICY "Course reps view policy" ON public.course_reps
    FOR SELECT USING (true);

CREATE POLICY "Course reps insert own record" ON public.course_reps
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins manage course reps" ON public.course_reps
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN')
        )
    );

-- 6. Assessments: Students can view scheduled or active assessments
CREATE POLICY "Assessments view policy" ON public.assessments
    FOR SELECT USING (
        status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'RESULTS_PUBLISHED')
    );

CREATE POLICY "Lecturers and admins manage assessments" ON public.assessments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER')
        )
    );

-- 7. Notifications: Targeted to user or broadcast
CREATE POLICY "User notifications policy" ON public.notifications
    FOR SELECT USING (
        user_id = auth.uid() OR user_id IS NULL
    );

-- 8. Audit logs: Users can record audit logs; privileged roles can view
CREATE POLICY "Users insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Audit logs privileged view" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'EXAMINATION_OFFICER')
        )
    );

-- 9. Automatic Profile & Student Trigger on Supabase Auth SignUp
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Profiles record
  INSERT INTO public.profiles (id, email, full_name, phone_number, role, institution_id)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone_number',
    'STUDENT'::public.user_role_enum,
    (CASE WHEN new.raw_user_meta_data->>'institution_id' IS NOT NULL AND new.raw_user_meta_data->>'institution_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
          THEN (new.raw_user_meta_data->>'institution_id')::uuid 
          ELSE NULL END)
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number);

  -- 2. If student metadata is provided, create students record
  IF (new.raw_user_meta_data->>'student_id') IS NOT NULL THEN
    INSERT INTO public.students (
      id,
      profile_id,
      student_id,
      institution_id,
      faculty_id,
      department_id,
      programme_id,
      level_id,
      academic_session_id,
      level_code,
      academic_session
    )
    VALUES (
      new.id,
      new.id,
      UPPER(TRIM(new.raw_user_meta_data->>'student_id')),
      (CASE WHEN new.raw_user_meta_data->>'institution_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'institution_id')::uuid ELSE NULL END),
      (CASE WHEN new.raw_user_meta_data->>'faculty_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'faculty_id')::uuid ELSE 'b1111111-1111-1111-1111-111111111111'::uuid END),
      (CASE WHEN new.raw_user_meta_data->>'department_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'department_id')::uuid ELSE 'c1111111-1111-1111-1111-111111111111'::uuid END),
      (CASE WHEN new.raw_user_meta_data->>'programme_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'programme_id')::uuid ELSE 'f1111111-1111-1111-1111-111111111111'::uuid END),
      (CASE WHEN new.raw_user_meta_data->>'level_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'level_id')::uuid ELSE NULL END),
      (CASE WHEN new.raw_user_meta_data->>'academic_session_id' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
            THEN (new.raw_user_meta_data->>'academic_session_id')::uuid ELSE NULL END),
      COALESCE(new.raw_user_meta_data->>'level_code', '300'),
      COALESCE(new.raw_user_meta_data->>'academic_session', '2024/2025')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition for auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================
-- SEED DATA: ADEYEMI FEDERAL UNIVERSITY OF EDUCATION (AFUED)
-- ==========================================================
DO $$
DECLARE
    v_inst_id UUID := 'a1111111-1111-1111-1111-111111111111';
    v_fac_sci UUID := 'b1111111-1111-1111-1111-111111111111';
    v_fac_edu UUID := 'b2222222-2222-2222-2222-222222222222';
    v_fac_art UUID := 'b3333333-3333-3333-3333-333333333333';
    v_fac_soc UUID := 'b4444444-4444-4444-4444-444444444444';
    v_fac_voc UUID := 'b5555555-5555-5555-5555-555555555555';
    v_dept_csc UUID := 'c1111111-1111-1111-1111-111111111111';
    v_dept_mat UUID := 'c2222222-2222-2222-2222-222222222222';
    v_dept_edf UUID := 'c3333333-3333-3333-3333-333333333333';
    v_dept_eng UUID := 'c4444444-4444-4444-4444-444444444444';
    v_dept_eco UUID := 'c5555555-5555-5555-5555-555555555555';
BEGIN
    -- 1. Institution
    INSERT INTO public.institutions (id, name, code, location)
    VALUES (v_inst_id, 'Adeyemi Federal University of Education', 'AFUED', 'Ondo City, Ondo State, Nigeria')
    ON CONFLICT (code) DO NOTHING;

    -- 2. Academic Sessions
    INSERT INTO public.academic_sessions (id, session_name, is_current)
    VALUES 
        ('d1111111-1111-1111-1111-111111111111', '2024/2025', TRUE),
        ('d2222222-2222-2222-2222-222222222222', '2023/2024', FALSE),
        ('d3333333-3333-3333-3333-333333333333', '2022/2023', FALSE)
    ON CONFLICT (session_name) DO UPDATE SET is_current = EXCLUDED.is_current;

    -- 3. Academic Levels
    INSERT INTO public.levels (id, level_code, level_name)
    VALUES 
        ('e1111111-1111-1111-1111-111111111111', '100', '100 Level (Year 1)'),
        ('e2222222-2222-2222-2222-222222222222', '200', '200 Level (Year 2)'),
        ('e3333333-3333-3333-3333-333333333333', '300', '300 Level (Year 3)'),
        ('e4444444-4444-4444-4444-444444444444', '400', '400 Level (Final Year)'),
        ('e5555555-5555-5555-5555-555555555555', '500', '500 Level (Extended)')
    ON CONFLICT (level_code) DO NOTHING;

    -- 4. Faculties
    INSERT INTO public.faculties (id, institution_id, name, code, dean_name)
    VALUES 
        (v_fac_sci, v_inst_id, 'Faculty of Science', 'FSC', 'Prof. A. O. Babatunde'),
        (v_fac_edu, v_inst_id, 'Faculty of Education', 'FED', 'Prof. (Mrs.) K. E. Adeola'),
        (v_fac_art, v_inst_id, 'Faculty of Arts & Humanities', 'FAH', 'Dr. O. M. Fashina'),
        (v_fac_soc, v_inst_id, 'Faculty of Social Sciences', 'FSS', 'Dr. T. J. Ojo'),
        (v_fac_voc, v_inst_id, 'Faculty of Vocational & Technical Education', 'FVT', 'Dr. B. K. Oladipo')
    ON CONFLICT (institution_id, code) DO NOTHING;

    -- 5. Departments
    INSERT INTO public.departments (id, faculty_id, name, code, hod_name)
    VALUES 
        (v_dept_csc, v_fac_sci, 'Department of Computer Science', 'CSC', 'Dr. I. A. Ogundele'),
        (v_dept_mat, v_fac_sci, 'Department of Mathematics', 'MAT', 'Dr. S. S. Adeleke'),
        (v_dept_edf, v_fac_edu, 'Department of Educational Foundations', 'EDF', 'Prof. M. A. Arowolo'),
        (v_dept_eng, v_fac_art, 'Department of English Studies', 'ENG', 'Dr. K. A. Daramola'),
        (v_dept_eco, v_fac_soc, 'Department of Economics', 'ECO', 'Dr. G. O. Fasanya')
    ON CONFLICT (faculty_id, code) DO NOTHING;

    -- 6. Programmes
    INSERT INTO public.programmes (id, department_id, name, code, duration_years)
    VALUES 
        ('f1111111-1111-1111-1111-111111111111', v_dept_csc, 'B.Sc. (Ed) Computer Science', 'CSC-BED', 4),
        ('f2222222-2222-2222-2222-222222222222', v_dept_csc, 'B.Sc. Computer Science', 'CSC-BSC', 4),
        ('f3333333-3333-3333-3333-333333333333', v_dept_mat, 'B.Sc. (Ed) Mathematics', 'MAT-BED', 4),
        ('f4444444-4444-4444-4444-444444444444', v_dept_edf, 'B.Ed Educational Management', 'EDM-BED', 4),
        ('f5555555-5555-5555-5555-555555555555', v_dept_eng, 'B.A. (Ed) English Studies', 'ENG-BED', 4),
        ('f6666666-6666-6666-6666-666666666666', v_dept_eco, 'B.Sc. (Ed) Economics', 'ECO-BED', 4)
    ON CONFLICT (code) DO NOTHING;
END $$;

-- ==========================================================
-- PHASE 3: THE COMPLETE DIGITAL ASSESSMENT ENGINE TABLES
-- ==========================================================

-- 1. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN ('CONTINUOUS_ASSESSMENT', 'TEST', 'MID_SEMESTER_TEST', 'EXAMINATION')),
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL,
    course_title TEXT NOT NULL,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
    semester TEXT NOT NULL DEFAULT 'FIRST' CHECK (semester IN ('FIRST', 'SECOND')),
    academic_session_id UUID REFERENCES public.academic_sessions(id) ON DELETE SET NULL,
    academic_session TEXT NOT NULL DEFAULT '2024/2025',
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_marks NUMERIC(6,2) NOT NULL DEFAULT 100.00,
    attempt_limit INTEGER NOT NULL DEFAULT 1,
    randomize_questions BOOLEAN NOT NULL DEFAULT TRUE,
    randomize_options BOOLEAN NOT NULL DEFAULT TRUE,
    allow_navigation BOOLEAN NOT NULL DEFAULT TRUE,
    allow_review BOOLEAN NOT NULL DEFAULT TRUE,
    auto_submit_on_expiry BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'scheduled', 'active', 'closed', 'archived')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Question Bank Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    course_code TEXT,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculties(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    programme_id UUID REFERENCES public.programmes(id) ON DELETE SET NULL,
    level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    marks NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    explanation TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Question Options (with option_order & is_correct)
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    option_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Assessment Questions (Linking questions to assessments)
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
    question_order INTEGER NOT NULL DEFAULT 0,
    marks NUMERIC(5,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_assessment_question UNIQUE (assessment_id, question_id)
);

-- 5. Assessment Assignments (Student authorization table)
CREATE TABLE IF NOT EXISTS public.assessment_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_assessment_assignment UNIQUE (assessment_id, student_id)
);

-- 6. Assessment Attempts (Records authorative server start & expiry times)
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    submitted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUBMITTED', 'AUTO_SUBMITTED', 'EXPIRED')),
    question_order JSONB,
    option_order_map JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Attempt Answers (Auto-saved answers per question)
CREATE TABLE IF NOT EXISTS public.attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES public.question_options(id) ON DELETE SET NULL,
    text_answer TEXT,
    is_marked_for_review BOOLEAN NOT NULL DEFAULT FALSE,
    marks_awarded NUMERIC(5,2),
    feedback TEXT,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_attempt_answer UNIQUE (attempt_id, question_id)
);

-- 8. Assessment Results (Calculated scores, grades, and publishing state)
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    objective_marks NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    subjective_marks NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    total_marks NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    grade TEXT NOT NULL DEFAULT 'F' CHECK (grade IN ('A', 'B', 'C', 'D', 'E', 'F')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'marked', 'approved', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid lookup
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_code);
CREATE INDEX IF NOT EXISTS idx_questions_course ON public.questions(course_id);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_student ON public.assessment_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student ON public.assessment_attempts(student_id, assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON public.attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON public.assessment_results(student_id);

-- Enable RLS on all assessment tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- Assessments: Students can view active or assigned assessments; Staff can manage
CREATE POLICY "Public or assigned assessments viewable" ON public.assessments
    FOR SELECT USING (
        status IN ('scheduled', 'active', 'closed') OR
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

CREATE POLICY "Lecturers and admins create assessments" ON public.assessments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

CREATE POLICY "Lecturers and admins update assessments" ON public.assessments
    FOR UPDATE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'EXAMINATION_OFFICER')
        )
    );

-- Questions: Only staff can create/modify questions
CREATE POLICY "Staff manage questions" ON public.questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

-- Question options: Staff can view all; Students can view options via view/policy
CREATE POLICY "Staff manage question options" ON public.question_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

-- Attempts: Students manage own attempts; Staff can view
CREATE POLICY "Students insert and view own attempts" ON public.assessment_attempts
    FOR SELECT USING (
        student_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

CREATE POLICY "Students create own attempt" ON public.assessment_attempts
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own attempt" ON public.assessment_attempts
    FOR UPDATE USING (student_id = auth.uid());

-- Attempt Answers: Students manage own answers; Lecturers can grade
CREATE POLICY "Students manage own answers" ON public.attempt_answers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.assessment_attempts a
            WHERE a.id = attempt_id AND a.student_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

-- Results: Students view only published results; Staff view all
CREATE POLICY "Students view published results, staff view all" ON public.assessment_results
    FOR SELECT USING (
        (student_id = auth.uid() AND status = 'published') OR
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );

CREATE POLICY "Staff update results" ON public.assessment_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('SUPER_ADMIN', 'INSTITUTION_ADMIN', 'LECTURER', 'EXAMINATION_OFFICER')
        )
    );


