from __future__ import annotations

import uuid
from datetime import date, datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import ARRAY, Boolean, CheckConstraint, Date, DateTime, ForeignKey, Integer, SmallInteger, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    problem: Mapped[str | None] = mapped_column(Text)
    stack: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    status: Mapped[str] = mapped_column(Text, default="active", nullable=False)
    demo_url: Mapped[str | None] = mapped_column(Text)
    repo_url: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dispatches: Mapped[list["Dispatch"]] = relationship(back_populates="project")
    milestones: Mapped[list["Milestone"]] = relationship(back_populates="project")


class NarrativeArc(Base):
    __tablename__ = "narrative_arcs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dispatches: Mapped[list["Dispatch"]] = relationship(back_populates="arc")


class Dispatch(Base):
    __tablename__ = "dispatches"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    arc_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("narrative_arcs.id"))
    body: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(Text, default="manual", nullable=False)
    idempotency_key: Mapped[str | None] = mapped_column(Text, nullable=True, unique=True)
    is_post_worthy: Mapped[bool | None] = mapped_column(Boolean)
    hold_reason: Mapped[str | None] = mapped_column(Text)
    angle: Mapped[str | None] = mapped_column(Text)
    suggested_platforms: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    avoid_topics: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    strategist_reasoning: Mapped[dict | None] = mapped_column(JSONB)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    project: Mapped[Project] = relationship(back_populates="dispatches")
    arc: Mapped[NarrativeArc | None] = relationship(back_populates="dispatches")
    drafts: Mapped[list["Draft"]] = relationship(back_populates="dispatch", cascade="all, delete-orphan")


class VoiceSample(Base):
    __tablename__ = "voice_samples"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))
    source_url: Mapped[str | None] = mapped_column(Text)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class VoiceProfile(Base):
    __tablename__ = "voice_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform: Mapped[str] = mapped_column(Text, default="all", nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Draft(Base):
    __tablename__ = "drafts"
    __table_args__ = (CheckConstraint("critic_score BETWEEN 1 AND 10", name="drafts_critic_score_check"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dispatch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("dispatches.id"), nullable=False)
    platform: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    reddit_title: Mapped[str | None] = mapped_column(Text)
    reddit_subreddit: Mapped[str | None] = mapped_column(Text)
    generation: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    critic_score: Mapped[int | None] = mapped_column(SmallInteger)
    critic_note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Text, default="draft", nullable=False)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    likes: Mapped[int | None] = mapped_column(Integer)
    comments: Mapped[int | None] = mapped_column(Integer)
    reposts: Mapped[int | None] = mapped_column(Integer)
    impressions: Mapped[int | None] = mapped_column(Integer)
    composio_post_id: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    dispatch: Mapped[Dispatch] = relationship(back_populates="drafts")


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    achieved_at: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    project: Mapped[Project] = relationship(back_populates="milestones")


class Outlet(Base):
    __tablename__ = "outlets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    composio_entity_id: Mapped[str | None] = mapped_column(Text)
    display_name: Mapped[str | None] = mapped_column(Text)
    is_connected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    connected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    approval_mode: Mapped[str] = mapped_column(Text, default="review_required", server_default="review_required", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


