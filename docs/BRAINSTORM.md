# Brainstorm Data Model

## Family

A group of people with guardians, children, and caregivers.

## Person

A member of a family as either a guardian, child, or caregiver.

### Guardian

A parent or guardian of a child, has access to the whole family.

### Child

A child of a guardian, has access to themselves and their general family.

### Caregiver

A non-parental guardian of children, has access to the children.

## Fact

Core of everything is a `fact`.
A fact is something that is true about a person. It helps OhPear determine whether an event or action is relevant to a person.

## Activity

An activity is something that a person does, which has events.

## Membership

A membership is a relationship between a person, activity, and schedule.

## Event

An event is something that happens at a specific time and date. It may or may not be relevant to a person (which creates an occurence).

## Occurence

An occurence is an event that a person is participating in (game, practice, meeting, etc.).

## Schedule

A schedule describes a series of occurences that have been assigned to a specific person (child or caregiver). Can either be regular (e.g. every day, every week, every month, every year) or irregular (e.g. a specific dates and times).

## Adjustment

An adjustment is a temporary change to an occurence. It is used to update an occurence based on new information.

### Cancellation

A cancellation is an adjustment that indicates an occurence of an event will not happen.

### Reschedule

A reschedule is an adjustment that changes the date of an occurence.

### Timechange

A timechange is an adjustment that changes the time of an occurence (on the same day).

### Break

A break is an adjustment that indicates that occurences of an event will not happen for a period of time.

### Move

A move is an adjustment that indicates that an occurence will happen in a different location.

## Consideration

A consideration is a fact that depends on conditions (weather, occurences, etc.).

### Equipment

Is particular equipment/clothing/gear required for an occurence?

### Food

Is particular food required for an occurence? (e.g. a meal, snacks, drinks)

### Transportation

Is particular transportation required for an occurence? (e.g. a ride to a practice or game)

### Preparation

Are any preparations required for an occurence? (e.g. purchases, homework, etc.)
