-- Add per-step completion tracking and extend allowed workflow statuses for the Applications dashboard.

ALTER TABLE user_applications
    ADD COLUMN IF NOT EXISTS steps_completed JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE user_applications
    DROP CONSTRAINT IF EXISTS chk_user_application_status;

ALTER TABLE user_applications
    ADD CONSTRAINT chk_user_application_status
        CHECK (
            status IN (
                'recommended',
                'likely_match',
                'documents_needed',
                'ready_to_apply',
                'official_application_started',
                'submitted',
                'follow_up_requested',
                'approved',
                'denied',
                'closed',
                'active',
                'terminated',
                'completed'
            )
        );
