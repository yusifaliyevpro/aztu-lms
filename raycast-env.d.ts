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
  /** Preferences accessible in the `see-announcements` command */
  export type SeeAnnouncements = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `login-account` command */
  export type LoginAccount = {}
  /** Arguments passed to the `see-announcements` command */
  export type SeeAnnouncements = {}
}

