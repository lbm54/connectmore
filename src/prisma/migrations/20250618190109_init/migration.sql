-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "file_id" VARCHAR(50),
    "file_url" TEXT,
    "icon_link" TEXT,
    "mime_type" VARCHAR(50),
    "title" VARCHAR(255),

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" INTEGER NOT NULL,
    "action" VARCHAR(10) NOT NULL,
    "changed_by" INTEGER,
    "changed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "old_values" JSONB,
    "new_values" JSONB,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendees" (
    "id" SERIAL NOT NULL,
    "instance_id" INTEGER,
    "user_id" INTEGER,
    "organizer" BOOLEAN,
    "self" BOOLEAN,
    "resource" BOOLEAN,
    "optional" BOOLEAN,
    "response_status" VARCHAR(50),
    "comment" TEXT,
    "additional_guests" INTEGER,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_categories" (
    "id" SERIAL NOT NULL,
    "category_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_instance_statuses" (
    "id" SERIAL NOT NULL,
    "status_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "event_instance_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_instances" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "instance_date" DATE,
    "start_time" TIME(6),
    "end_time" TIME(6),
    "instance_end_date" DATE,
    "instance_html_link" TEXT,
    "instance_summary" VARCHAR(255),
    "instance_description" TEXT,
    "instance_start_date" DATE,
    "instance_thumbnail_address" VARCHAR(2500),
    "instance_image_address" VARCHAR(2500),
    "instance_name" VARCHAR(500),
    "instance_venue_id" INTEGER,
    "instance_subcategory_id" INTEGER,
    "instance_start_time" VARCHAR(50),
    "instance_end_time" VARCHAR(50),
    "instance_video_url" VARCHAR(2500),
    "status_id" INTEGER,
    "start_datetime" TIMESTAMP(6),
    "end_datetime" TIMESTAMP(6),
    "current_attendees" INTEGER DEFAULT 0,
    "max_attendees" INTEGER,
    "allow_waitlist" BOOLEAN DEFAULT true,
    "uses_event_name" BOOLEAN DEFAULT true,
    "uses_event_description" BOOLEAN DEFAULT true,

    CONSTRAINT "event_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_statuses" (
    "id" SERIAL NOT NULL,
    "status_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "event_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_subcategories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "subcategory_name" VARCHAR(255),

    CONSTRAINT "event_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_waitlist" (
    "id" SERIAL NOT NULL,
    "event_instance_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "waitlist_position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "event_id" VARCHAR(50),
    "status" VARCHAR(50),
    "html_link" TEXT,
    "created" TIMESTAMP(6),
    "updated" TIMESTAMP(6),
    "summary" VARCHAR(255),
    "description" TEXT,
    "creator_id" VARCHAR(50),
    "organizer_id" INTEGER,
    "start_date" DATE,
    "end_date" DATE,
    "recurrence" VARCHAR(255),
    "recurring_event_id" VARCHAR(50),
    "ical_uid" VARCHAR(50),
    "locked" BOOLEAN,
    "category_id" INTEGER,
    "thumbnail_address" VARCHAR(2500),
    "image_address" VARCHAR(2500),
    "name" VARCHAR(500),
    "venue_id" INTEGER,
    "guests_can_invite_others" INTEGER,
    "subcategory_id" INTEGER,
    "start_time" VARCHAR(50),
    "end_time" VARCHAR(50),
    "source" VARCHAR(100),
    "is_featured" BOOLEAN DEFAULT false,
    "is_super_featured" BOOLEAN DEFAULT false,
    "search_vector" tsvector,
    "is_checked" BOOLEAN DEFAULT false,
    "importance" INTEGER DEFAULT 1,
    "video_url" VARCHAR(2500),
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(5),
    "zip" VARCHAR(10),
    "start_datetime" TIMESTAMP(6),
    "end_datetime" TIMESTAMP(6),
    "status_id" INTEGER,
    "custom_venue_name" VARCHAR(255),
    "use_custom_venue" BOOLEAN DEFAULT false,
    "is_recurring" BOOLEAN DEFAULT false,
    "recurrence_end_date" DATE,
    "instance_template_name" VARCHAR(500),
    "instance_template_desc" TEXT,
    "max_attendees" INTEGER,
    "snippet" VARCHAR(100),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_flags" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "flag_id" INTEGER NOT NULL,
    "details" TEXT,

    CONSTRAINT "events_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events_tags" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "events_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flags" (
    "id" SERIAL NOT NULL,
    "flag" VARCHAR(20) NOT NULL,

    CONSTRAINT "flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_files" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "file_key" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "upload_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizer_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizer_quota" (
    "organizer_id" INTEGER NOT NULL,
    "quota_limit" BIGINT NOT NULL DEFAULT 104857600,
    "last_updated" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizer_quota_pkey" PRIMARY KEY ("organizer_id")
);

-- CreateTable
CREATE TABLE "organizer_social_media" (
    "id" SERIAL NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "username" VARCHAR(100),

    CONSTRAINT "organizer_social_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(50),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(50),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(100),
    "website_url" VARCHAR(255),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "image_url" VARCHAR(1000),
    "events_url" VARCHAR(500),
    "is_checked" BOOLEAN DEFAULT false,
    "aliases" JSONB,
    "auth_userid" VARCHAR(100),

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "permission_name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "tag_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255),
    "self" BOOLEAN,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(6),
    "is_active" BOOLEAN DEFAULT true,
    "organizer_id" INTEGER,
    "userid" VARCHAR(50),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_log_changed_at" ON "audit_log"("changed_at");

-- CreateIndex
CREATE INDEX "idx_audit_log_changed_by" ON "audit_log"("changed_by");

-- CreateIndex
CREATE INDEX "idx_audit_log_table_record" ON "audit_log"("table_name", "record_id");

-- CreateIndex
CREATE INDEX "idx_event_attendees_user" ON "event_attendees"("user_id");

-- CreateIndex
CREATE INDEX "idx_event_instances_dates" ON "event_instances"("instance_date", "instance_start_date", "instance_end_date");

-- CreateIndex
CREATE INDEX "idx_event_instances_end_date" ON "event_instances"("instance_end_date");

-- CreateIndex
CREATE INDEX "idx_event_instances_start_date" ON "event_instances"("instance_start_date");

-- CreateIndex
CREATE INDEX "idx_event_instances_status_id" ON "event_instances"("status_id");

-- CreateIndex
CREATE INDEX "idx_event_instances_subcategory_id" ON "event_instances"("instance_subcategory_id");

-- CreateIndex
CREATE INDEX "idx_event_instances_venue_id" ON "event_instances"("instance_venue_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_statuses_status_name_key" ON "event_statuses"("status_name");

-- CreateIndex
CREATE INDEX "idx_event_waitlist_instance" ON "event_waitlist"("event_instance_id");

-- CreateIndex
CREATE INDEX "idx_event_waitlist_user" ON "event_waitlist"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_waitlist_event_instance_id_user_id_key" ON "event_waitlist"("event_instance_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_event_id_key" ON "events"("event_id");

-- CreateIndex
CREATE INDEX "idx_events_category" ON "events"("category_id");

-- CreateIndex
CREATE INDEX "idx_events_dates" ON "events"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_events_name" ON "events"("name");

-- CreateIndex
CREATE INDEX "idx_events_organizer" ON "events"("organizer_id");

-- CreateIndex
CREATE INDEX "idx_events_status" ON "events"("status");

-- CreateIndex
CREATE INDEX "idx_events_subcategory" ON "events"("subcategory_id");

-- CreateIndex
CREATE INDEX "idx_search_vector" ON "events" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "idx_events_tags_event" ON "events_tags"("event_id");

-- CreateIndex
CREATE INDEX "idx_events_tags_tag" ON "events_tags"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "events_tags_event_id_tag_id_key" ON "events_tags"("event_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_files_file_key_key" ON "organizer_files"("file_key");

-- CreateIndex
CREATE INDEX "idx_organizer_files_organizer_id" ON "organizer_files"("organizer_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizer_social_media_organizer_id_platform_key" ON "organizer_social_media"("organizer_id", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_pk" ON "tags"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_users_userid" ON "users"("userid");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "event_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_instances" ADD CONSTRAINT "event_instances_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_instances" ADD CONSTRAINT "event_instances_instance_subcategory_id_fkey" FOREIGN KEY ("instance_subcategory_id") REFERENCES "event_subcategories"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_instances" ADD CONSTRAINT "event_instances_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "event_instance_statuses"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_subcategories" ADD CONSTRAINT "fk_subcategories_category" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_waitlist" ADD CONSTRAINT "event_waitlist_event_instance_id_fkey" FOREIGN KEY ("event_instance_id") REFERENCES "event_instances"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_waitlist" ADD CONSTRAINT "event_waitlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "event_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "event_subcategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_events_status" FOREIGN KEY ("status_id") REFERENCES "event_statuses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_flags" ADD CONSTRAINT "events_flags_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events_flags" ADD CONSTRAINT "events_flags_flag_id_fkey" FOREIGN KEY ("flag_id") REFERENCES "flags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events_tags" ADD CONSTRAINT "events_tags_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizer_social_media" ADD CONSTRAINT "organizer_social_media_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "organizers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
