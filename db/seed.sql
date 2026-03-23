-- Seed data for benefits guidance platform

INSERT INTO users (
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    city,
    state,
    zip_code,
    household_size,
    income_range,
    employment_status,
    housing_status,
    disability_status,
    veteran_status,
    preferred_language
) VALUES
(
    'Nathan',
    'Nottingham',
    'nathan@example.com',
    '801-555-0101',
    '2004-06-15',
    'Provo',
    'Utah',
    '84604',
    1,
    150000,
    'Part-time',
    'Renter',
    'No disability reported',
    'Not a veteran',
    'English'
),
(
    'Maria',
    'Lopez',
    'maria@example.com',
    '385-555-0144',
    '1996-09-22',
    'Orem',
    'Utah',
    '84057',
    3,
    40000,
    'Unemployed',
    'Renter',
    'No disability reported',
    'Not a veteran',
    'English'
),
(
    'James',
    'Carter',
    'james@example.com',
    '801-555-0199',
    '1958-02-11',
    'Salt Lake City',
    'Utah',
    '84103',
    2,
    20000,
    'Retired',
    'Homeowner',
    'Has a disability',
    'Veteran',
    'English'
);

INSERT INTO login (
    user_id,
    username,
    password_hash,
    last_login_at,
    is_active
) VALUES
(1, 'nnottingham', '$2b$12$examplehashfornathan', CURRENT_TIMESTAMP, TRUE),
(2, 'mlopez', '$2b$12$examplehashformaria', CURRENT_TIMESTAMP, TRUE),
(3, 'jcarter', '$2b$12$examplehashforjames', CURRENT_TIMESTAMP, TRUE);

INSERT INTO applications (
    application_name,
    category,
    description,
    qualification_summary,
    official_url,
    application_steps
) VALUES
(
    'SNAP',
    'Food Assistance',
    'Supplemental Nutrition Assistance Program that helps eligible households buy groceries.',
    'Generally for low-income households; eligibility depends on state rules, household size, income, and other factors.',
    'https://www.usa.gov/food-stamps',
    '1. Check your state SNAP page. 2. Gather ID, income, address, and household information. 3. Submit the application through the official state portal. 4. Complete any required interview. 5. Respond to follow-up requests from the state agency.'
),
(
    'WIC',
    'Food Assistance',
    'Nutrition support for eligible pregnant people, postpartum people, infants, and children under 5.',
    'Typically available to qualifying pregnant or postpartum applicants, infants, and young children who meet income and residency requirements.',
    'https://www.fns.usda.gov/wic',
    '1. Confirm category eligibility. 2. Find the local WIC clinic. 3. Gather identity, address, and income documents. 4. Schedule and attend the certification appointment. 5. Follow clinic instructions for benefits issuance.'
),
(
    'Medicaid/CHIP',
    'Health Coverage',
    'Government health coverage for eligible low-income adults, children, pregnant people, seniors, and people with disabilities.',
    'Eligibility varies by state and may depend on income, age, disability, pregnancy, and household composition.',
    'https://www.healthcare.gov/medicaid-chip/',
    '1. Review your state eligibility path. 2. Gather household and income information. 3. Apply through your state Medicaid agency or HealthCare.gov. 4. Submit any verification documents requested. 5. Watch for an eligibility notice.'
),
(
    'Unemployment Insurance',
    'Income Support',
    'Temporary cash benefits for workers who lose employment and meet state eligibility requirements.',
    'Usually for people who lost work through qualifying circumstances and are able and available to work, subject to state rules.',
    'https://www.careeronestop.org/LocalHelp/UnemploymentBenefits/find-unemployment-benefits.aspx',
    '1. Apply in the state where you worked. 2. Gather employer history and wage details. 3. Complete identity verification. 4. Submit the official unemployment claim. 5. File ongoing weekly or biweekly certifications if required.'
),
(
    'TANF',
    'Cash Assistance',
    'Temporary Assistance for Needy Families provides state-run cash assistance and related services.',
    'Usually for low-income families with dependent children, based on state-specific rules.',
    'https://www.usa.gov/welfare-benefits',
    '1. Check your state TANF office. 2. Gather household, child, and income information. 3. Submit the official application. 4. Complete interviews or work-program steps if required. 5. Respond to agency notices.'
),
(
    'Housing Assistance',
    'Housing',
    'Includes Section 8, public housing, and other subsidized housing programs administered locally.',
    'Eligibility often depends on income, household size, location, and local public housing agency rules.',
    'https://www.usa.gov/rental-housing-programs',
    '1. Identify the right local housing program or public housing agency. 2. Gather identity, household, and income documents. 3. Submit the official housing application. 4. Join the waitlist if applicable. 5. Complete verification steps when contacted.'
),
(
    'SSI/SSDI',
    'Disability Benefits',
    'Social Security disability-related benefits including SSI and SSDI.',
    'SSDI is generally tied to work history; SSI is generally needs-based for eligible disabled, blind, or older individuals with limited income/resources.',
    'https://www.ssa.gov/benefits/disability/',
    '1. Determine whether SSI, SSDI, or both may apply. 2. Gather medical, work, and income information. 3. Start the application through SSA. 4. Submit requested forms and evidence. 5. Monitor for a decision or appeal options.'
),
(
    'LIHEAP / Weatherization',
    'Utilities',
    'Help with energy bills and home weatherization through local or state-administered programs.',
    'Usually based on household income, utility burden, and local program rules.',
    'https://www.usa.gov/help-with-energy-bills',
    '1. Find the local LIHEAP or weatherization office. 2. Gather utility bills, income, and household details. 3. Submit the official local application. 4. Provide additional verification if asked. 5. Wait for approval or scheduling.'
),
(
    'FAFSA',
    'Education Aid',
    'Federal student aid application used for grants, loans, and work-study.',
    'Students seeking federal student aid and contributors who must provide financial information.',
    'https://studentaid.gov/h/apply-for-aid/fafsa',
    '1. Create required StudentAid.gov accounts. 2. Gather tax and financial records. 3. Complete the FAFSA online. 4. Add schools and contributors. 5. Submit signatures and review follow-up requests from schools.'
),
(
    'Medicare',
    'Health Coverage',
    'Federal health insurance program primarily for people 65+ and certain younger people with disabilities.',
    'Generally for people age 65 or older or certain eligible younger individuals with disabilities or specific conditions.',
    'https://www.usa.gov/medicare',
    '1. Determine whether you are automatically enrolled or need to apply. 2. Review enrollment timing. 3. Start the official Medicare or SSA enrollment flow. 4. Choose coverage options if needed. 5. Confirm enrollment status.'
);

INSERT INTO user_applications (
    user_id,
    application_id,
    status,
    date_started,
    last_updated,
    notes
) VALUES
(1, 9, 'ready_to_apply', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Student preparing FAFSA for the upcoming academic year.'),
(2, 1, 'documents_needed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Needs proof of income and proof of address before starting SNAP.'),
(2, 4, 'official_application_started', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Began state unemployment claim after recent job loss.'),
(3, 7, 'follow_up_requested', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'SSA requested additional medical documentation.'),
(3, 10, 'submitted', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Enrollment materials submitted during the coverage window.');

INSERT INTO chat_threads (
    user_id,
    title,
    created_at,
    updated_at,
    is_archived
) VALUES
(1, 'College financial aid questions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
(2, 'Food and unemployment help', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE),
(3, 'Disability and Medicare guidance', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE);

INSERT INTO chat_messages (
    thread_id,
    sender_type,
    message_text,
    created_at,
    sequence_number
) VALUES
(1, 'user', 'I need help figuring out what financial aid application to complete for school.', CURRENT_TIMESTAMP, 1),
(1, 'assistant', 'You should start with FAFSA and gather your tax and contributor information before using the official StudentAid.gov form.', CURRENT_TIMESTAMP, 2),
(2, 'user', 'I lost my job and I am worried about groceries this month.', CURRENT_TIMESTAMP, 1),
(2, 'assistant', 'You may want to look into both SNAP and unemployment insurance. I can walk you through the steps before you use the official sites.', CURRENT_TIMESTAMP, 2),
(3, 'user', 'I need help understanding disability benefits and Medicare enrollment.', CURRENT_TIMESTAMP, 1),
(3, 'assistant', 'I can help you compare SSI and SSDI, outline the documents you need, and explain the official Medicare enrollment steps.', CURRENT_TIMESTAMP, 2);

INSERT INTO required_documents (
    application_id,
    document_name,
    description,
    required_flag
) VALUES
(1, 'Photo ID', 'Government-issued identification for the SNAP applicant.', TRUE),
(1, 'Proof of Income', 'Recent pay stubs, benefit statements, or other income records.', TRUE),
(1, 'Proof of Address', 'Lease, utility bill, or other residency documentation.', TRUE),

(2, 'Photo ID', 'Identification for the WIC applicant or guardian.', TRUE),
(2, 'Proof of Income', 'Income documentation used by the local WIC office.', TRUE),
(2, 'Proof of Pregnancy or Child Eligibility', 'Medical or birth documentation as applicable.', TRUE),

(3, 'Social Security Numbers', 'SSNs or eligible documentation for household members if available.', TRUE),
(3, 'Proof of Income', 'Pay stubs, tax information, or other household income evidence.', TRUE),
(3, 'Immigration Documents', 'Only if relevant to the applicant’s situation.', FALSE),

(4, 'Employment History', 'Employer names, dates worked, and wage details.', TRUE),
(4, 'Identity Verification', 'Documents needed by the state unemployment office to verify identity.', TRUE),

(5, 'Household Information', 'Names and details for people in the household.', TRUE),
(5, 'Proof of Income', 'Income documents required by the state TANF office.', TRUE),

(6, 'Photo ID', 'Identification for the housing applicant.', TRUE),
(6, 'Proof of Income', 'Income records for everyone in the household.', TRUE),
(6, 'Household Composition', 'Information about family size and dependents.', TRUE),

(7, 'Medical Records', 'Provider records, diagnoses, and treatment history.', TRUE),
(7, 'Work History', 'Prior jobs and work dates for disability review.', TRUE),
(7, 'Income and Resource Information', 'Financial information used for SSI eligibility.', FALSE),

(8, 'Utility Bill', 'Recent bill showing service and account details.', TRUE),
(8, 'Proof of Income', 'Income verification for energy assistance programs.', TRUE),

(9, 'Tax Information', 'Student and contributor financial information.', TRUE),
(9, 'School List', 'The schools that should receive the FAFSA.', TRUE),

(10, 'Proof of Age or Disability Eligibility', 'Information supporting Medicare enrollment status.', TRUE),
(10, 'Current Coverage Information', 'Information about any current employer or other health coverage.', FALSE);
