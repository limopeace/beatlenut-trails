# ESM Marketplace Dynamics Documentation

## Core Principles

The ESM (Experiential Services Marketplace) portal is designed to connect ex-servicemen providers with potential customers in a secure, transparent environment. The following dynamics are critical to its operation:

1. **Conversation-First Approach**: Engagement between parties requires meaningful conversation before other actions
2. **Admin Oversight**: All critical actions require admin visibility or approval
3. **Trust Building**: Mechanisms to establish trust between parties
4. **Process Documentation**: Logging of interactions for accountability and dispute resolution

## Conversation-Based Interactions

### Rating System Rules

1. **Conversation Prerequisite**:
   - A user can only rate another user if they have exchanged at least 3 messages
   - The conversation must be at least 48 hours old before rating is allowed
   - Both parties must have participated in the conversation

2. **Rating Constraints**:
   - Ratings can only be given for actual interactions (conversation, purchase, or service)
   - System should detect if a genuine service/product exchange occurred
   - Ratings should be tied to specific conversations or transactions

3. **Rating Transparency**:
   - Both parties can see ratings and reviews
   - Admin can flag or remove inappropriate reviews
   - Reviews cannot be edited after 7 days

### Project Initiation via Conversation

1. **Conversation Logging**:
   - Conversations can be marked as "Project Discussions" by either party
   - Once both parties agree, conversation is officially logged as a project
   - System timestamps the project initiation
   - Project conversations have special visibility to admins for monitoring

2. **Project Milestone Tracking**:
   - Key agreements in conversations can be marked as milestones
   - Milestones appear in both parties' dashboards
   - Admin can view milestone history for dispute resolution

3. **Documentation Sharing**:
   - Special attachment types for project specifications
   - Versioning of shared documents
   - Requires acknowledgment from receiving party

### Contact Information Sharing

1. **Controlled Disclosure**:
   - Contact information is not automatically visible
   - Users can request contact sharing through a formal request
   - Recipient must approve sharing
   - System logs when contact information is shared

2. **Verified Information Only**:
   - Only verified contact methods can be shared
   - System warns about sharing unverified contact information
   - Option to use platform-provided communication methods instead

3. **Sharing Limitations**:
   - Limited to business contact information only
   - Personal addresses require special approval
   - Rate-limited to prevent spam

## Admin Oversight

### Registration Approval Workflow

1. **Initial Registration Process**:
   - Basic user account creation (email, password, basic info)
   - Upload of verification documents (service credentials, identity proof)
   - Acceptance of marketplace terms and conditions

2. **Admin Verification Process**:
   - Admin dashboard shows pending registrations
   - Two-step verification: document authenticity and service record
   - Option to request additional information
   - Approval/rejection with mandatory reason

3. **Seller/Provider Elevation Process**:
   - Standard users can apply to become sellers/providers
   - Additional documentation requirements for business operation
   - Admin review of service/product offerings
   - Probationary period for new sellers

### Conversation Monitoring

1. **Admin Visibility Rules**:
   - All conversations are subject to review for policy violations
   - Flagged conversations appear in admin dashboard
   - Project-marked conversations have higher visibility
   - Keyword monitoring for potential issues (contact sharing outside system, payment outside system)

2. **Report System**:
   - Both parties can report inappropriate behavior
   - Reports include conversation context automatically
   - Admin can freeze conversations during investigation

3. **Intervention Protocols**:
   - Guidelines for when admins should intervene in conversations
   - Standard responses for common violations
   - Escalation path for serious issues

### Transaction Oversight

1. **Service/Product Listing Approval**:
   - All new listings require admin approval
   - Updates to existing listings are reviewed
   - Automated checks for prohibited items/services

2. **Dispute Resolution Access**:
   - Admin can access full conversation history
   - Transaction records are linked to conversations
   - Timeline view of all interactions between parties

## CRUD Operations Requirements

### Seller Profile Operations

1. **Create**:
   - Basic profile information (name, business name, contact info)
   - Service/product categories offered
   - Service background information
   - Geographic service area
   - Upload of supporting documents
   - Status set to "Pending Approval"

2. **Read**:
   - Public profile view (approved information only)
   - Seller's own complete profile view
   - Admin full profile view with approval history

3. **Update**:
   - Edit business information (some changes require re-approval)
   - Update service offerings
   - Modify operational hours/availability
   - Change contact preferences
   - Update profile media (photos, videos)

4. **Delete**:
   - Account deactivation (temporary)
   - Account deletion request (requires admin review)
   - Service offering removal

### Buyer Profile Operations

1. **Create**:
   - Basic profile (name, contact info)
   - Interests/needs categories
   - Optional verification status
   - Communication preferences

2. **Read**:
   - Limited public profile
   - Full self-view
   - Admin view with activity history

3. **Update**:
   - Edit personal information
   - Update interests/preferences
   - Modify privacy settings
   - Change notification preferences

4. **Delete**:
   - Account deactivation option
   - Full deletion request
   - Data export before deletion

## Implementation Priorities

### Phase 1: Core Functionality
- Complete messaging system (✓)
- Seller/buyer registration flows with admin approval
- Basic profile CRUD operations
- Admin dashboard for registration oversight

### Phase 2: Trust Building
- Conversation-based rating system
- Contact information sharing mechanism
- Project conversation logging
- Enhanced admin conversation monitoring

### Phase 3: Transaction Enablement
- Order management refinements
- Dispute resolution tools
- Rating system expansions
- Analytics and reporting

## Design Considerations

1. **User Interface**:
   - Clear indication of conversation status (casual vs. project)
   - Visual cues for admin-approved profiles
   - Intuitive contact sharing request process
   - Simple project milestone tracking

2. **Backend Architecture**:
   - Robust conversation logging with immutable records
   - Transaction-conversation linking mechanism
   - Efficient admin dashboard queries
   - Flexible approval workflow pipeline

3. **Security & Privacy**:
   - End-to-end encryption for sensitive information
   - Role-based access controls for admin functions
   - Granular privacy settings for users
   - Audit logs for all admin actions

## Metrics for Success

1. **Engagement Metrics**:
   - Conversation initiation rate
   - Response time averages
   - Conversation to project conversion rate
   - User return frequency

2. **Trust Metrics**:
   - Rating submission rate
   - Average rating scores
   - Contact sharing acceptance rate
   - Dispute frequency

3. **Admin Effectiveness**:
   - Registration approval time
   - Listing approval time
   - Issue resolution time
   - User satisfaction with admin interventions