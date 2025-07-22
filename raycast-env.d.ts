/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** AzTU LMS username - Write your AzTU LMS username */
  "username": string,
  /** AzTU LMS password - Write your AzTU LMS password */
  "password": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `login-account` command */
  export type LoginAccount = ExtensionPreferences & {}
  /** Preferences accessible in the `delete-session` command */
  export type DeleteSession = ExtensionPreferences & {}
  /** Preferences accessible in the `announcements` command */
  export type Announcements = ExtensionPreferences & {}
  /** Preferences accessible in the `profile-info` command */
  export type ProfileInfo = ExtensionPreferences & {}
  /** Preferences accessible in the `transcript` command */
  export type Transcript = ExtensionPreferences & {}
  /** Preferences accessible in the `attendance` command */
  export type Attendance = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `login-account` command */
  export type LoginAccount = {}
  /** Arguments passed to the `delete-session` command */
  export type DeleteSession = {}
  /** Arguments passed to the `announcements` command */
  export type Announcements = {}
  /** Arguments passed to the `profile-info` command */
  export type ProfileInfo = {}
  /** Arguments passed to the `transcript` command */
  export type Transcript = {}
  /** Arguments passed to the `attendance` command */
  export type Attendance = {}
}

