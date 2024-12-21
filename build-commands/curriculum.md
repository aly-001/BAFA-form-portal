# macOS Electron App Development & Distribution Guide

## 1. Code Signing (codesign)
* **Definition**: Apple's command-line tool for cryptographic signatures
* **Core Components**:
  * **Digital Signature**
    * Cryptographic hash of the application
    * Proves app integrity
    * Links to developer's identity
  * **Certificate Chain**
    * Links your Developer ID to Apple's root certificate
    * Validates authenticity of signatures
    * Enables trust verification

* **Key Functions**:
  * **Signature Application**
    * Signs individual files and bundles
    * Preserves code integrity
    * Embeds developer identity
  * **Secure Timestamps**
    * Records signing time
    * Maintains validity post-certificate expiration
    * Provides audit trail
  * **Hardened Runtime**
    * Enforces security restrictions
    * Controls system resource access
    * Manages entitlements

* **Command Line Usage**:
  ```bash
  # Basic signing
  codesign --sign "Developer ID Application: Your Name (TEAM_ID)" --options runtime /path/to/YourApp.app

  # Deep signing (all nested components)
  codesign --sign "Developer ID Application: Your Name (TEAM_ID)" --options runtime --deep /path/to/YourApp.app

  # Verification
  codesign --verify --verbose=4 /path/to/YourApp.app
  ```

* **Common Flags**:
  * `--sign`: Specifies signing identity
  * `--deep`: Signs nested components
  * `--force`: Overwrites existing signatures
  * `--options runtime`: Enables hardened runtime
  * `--entitlements`: Specifies entitlements file

* **Troubleshooting**:
  * **Common Issues**:
    * Missing certificates
    * Keychain access problems
    * Invalid bundle structure
  * **Verification Tools**:
    * `codesign --verify`
    * `spctl --assess`
    * `pkgutil --check-signature`

* **Best Practices**:
  * Sign all executable components
  * Include secure timestamps
  * Verify signatures after signing
  * Maintain proper entitlements
  * Regular certificate renewal
  * Automated signing in build process

## 2. Binaries in Electron Apps
* **Definition**: 
  * Compiled, executable machine code files
  * Core components that make up the application bundle
  * Platform-specific executable formats

* **Main Types**:
  * **Primary Executable**
    * Core application binary
    * Located in `/Contents/MacOS/`
    * Named after your application
    * Entry point for the app

  * **Helper Processes**
    * **Renderer Helper**
      * Handles web page rendering
      * Manages DOM interactions
      * Processes JavaScript in web pages
    * **GPU Helper**
      * Manages hardware acceleration
      * Handles WebGL content
      * Processes graphics operations
    * **Plugin Helper**
      * Supports browser plugins
      * Manages external integrations
      * Handles legacy plugin content

  * **Framework Binaries**
    * **Electron Framework**
      * Core runtime environment
      * Chromium components
      * Node.js integration
    * **System Frameworks**
      * `.dylib` files (dynamic libraries)
      * System integrations
      * Shared resources

* **Binary Locations**:
  ```bash
  YourApp.app/
  ├── Contents/
  │   ├── MacOS/
  │   │   ├── YourApp                     # Main executable
  │   │   ├── YourApp Helper (Renderer)   # Renderer process
  │   │   ├── YourApp Helper (GPU)        # GPU process
  │   │   └── YourApp Helper (Plugin)     # Plugin process
  │   ├── Frameworks/
  │   │   ├── Electron Framework.framework
  │   │   └── Other .dylib files
  │   └── Resources/                      # Your app's resources
  ```

* **Security Requirements**:
  * **Signing Requirements**
    * All binaries must be signed
    * Signatures must use same certificate
    * Hardened runtime enabled
  * **Entitlements**
    * Required for system access
    * Must be consistent across binaries
    * Specific to each helper type

* **Best Practices**:
  * **Organization**
    * Maintain clear bundle structure
    * Follow Apple's naming conventions
    * Keep helper processes minimal
  * **Performance**
    * Optimize binary sizes
    * Manage process lifecycle
    * Control helper process creation
  * **Security**
    * Regular security updates
    * Proper permission management
    * Sandbox configuration

* **Common Issues**:
  * **Missing Helpers**
    * Incomplete bundle structure
    * Installation corruption
    * Build configuration errors
  * **Permission Problems**
    * Incorrect entitlements
    * Signing mismatches
    * Bundle integrity issues
  * **Performance Issues**
    * Too many helper processes
    * Memory leaks
    * Resource contention

## 3. Building an Electron App

* **Development Environment Setup**:
  * **Required Tools**:
    * Node.js and npm/yarn
    * Git for version control
    * Code editor (VS Code recommended)
    * Xcode Command Line Tools
  * **Project Initialization**:
    * Create package.json
    * Install Electron dependencies
    * Configure TypeScript (optional)
    * Set up build scripts

* **Application Structure**:
  * **Main Process**:
    * Entry point (main.js/ts)
    * Window management
    * System integration
    * IPC handling
  * **Renderer Process**:
    * UI components
    * Business logic
    * User interactions
    * Web technologies (HTML/CSS/JS)
  * **Preload Scripts**:
    * Security bridge
    * Context isolation
    * API exposure

* **Build Configuration**:
  * **electron-builder Setup**:
    ```json
    {
      "appId": "com.your.app",
      "mac": {
        "category": "public.app-category.developer-tools",
        "hardenedRuntime": true,
        "gatekeeperAssess": false,
        "entitlements": "build/entitlements.mac.plist",
        "entitlementsInherit": "build/entitlements.mac.plist",
        "signIgnore": [
          "node_modules/*"
        ]
      }
    }
    ```
  * **Build Scripts**:
    ```json
    {
      "scripts": {
        "start": "electron .",
        "build": "electron-builder build --mac",
        "dist": "electron-builder build -mwl"
      }
    }
    ```

* **Resource Management**:
  * **Asset Organization**:
    * Static files (images, fonts)
    * Localization files
    * Configuration files
    * Database files
  * **Bundle Optimization**:
    * Minification
    * Tree shaking
    * Asset compression
    * Code splitting

* **Development Workflow**:
  * **Local Development**:
    * Hot reload setup
    * DevTools integration
    * Error handling
    * Debugging tools
  * **Testing**:
    * Unit tests
    * Integration tests
    * E2E testing
    * Performance testing

* **Build Process**:
  * **Pre-build Steps**:
    * Clean previous builds
    * Dependency validation
    * Environment setup
    * Resource compilation
  * **Build Execution**:
    * Source compilation
    * Resource bundling
    * Binary generation
    * Helper process creation
  * **Post-build Steps**:
    * Code signing
    * Notarization
    * DMG creation
    * Update package generation

* **Distribution Preparation**:
  * **App Bundle Structure**:
    ```bash
    YourApp.app/
    ├── Contents/
    │   ├── Info.plist
    │   ├── MacOS/
    │   │   └── YourApp
    │   ├── Frameworks/
    │   └── Resources/
    │       ├── app.asar
    │       └── electron.asar
    ```
  * **Distribution Methods**:
    * Direct download
    * Auto-update system
    * App stores
    * Enterprise deployment

* **Best Practices**:
  * **Performance**:
    * Optimize startup time
    * Minimize memory usage
    * Efficient IPC communication
    * Resource lazy loading
  * **Security**:
    * Context isolation
    * CSP implementation
    * Dependency auditing
    * Regular updates
  * **User Experience**:
    * Native OS integration
    * Responsive design
    * Offline capabilities
    * Error recovery

* **Common Issues & Solutions**:
  * **Build Failures**:
    * Missing dependencies
    * Incorrect configurations
    * Signing issues
  * **Runtime Issues**:
    * IPC communication errors
    * Memory leaks
    * Performance bottlenecks
  * **Distribution Problems**:
    * Notarization failures
    * Update system errors
    * Installation issues

## 4. macOS App Notarization

* **Overview**:
  * **Definition**:
    * Apple's security verification process
    * Automated malware scanning
    * Required for macOS 10.15+
  * **Purpose**:
    * Ensures app safety
    * Prevents malware distribution
    * Maintains system security

* **Prerequisites**:
  * **Developer Requirements**:
    * Valid Apple Developer account
    * Developer ID Application certificate
    * App-specific password
  * **Technical Requirements**:
    * Hardened Runtime enabled
    * Valid code signature
    * Proper entitlements

* **Notarization Process**:
  * **Preparation**:
    ```bash
    # Create ZIP archive for notarization
    ditto -c -k --keepParent "YourApp.app" "YourApp.zip"
    
    # Or for DMG
    create-dmg YourApp.app
    ```
  
  * **Submission**:
    ```bash
    # Using notarytool (recommended for Xcode 13+)
    xcrun notarytool submit YourApp.zip \
      --apple-id "your@email.com" \
      --password "app-specific-password" \
      --team-id "YOUR_TEAM_ID" \
      --wait
    
    # Alternative using altool (legacy)
    xcrun altool --notarize-app \
      --primary-bundle-id "com.your.app" \
      --username "your@email.com" \
      --password "app-specific-password" \
      --file YourApp.zip
    ```

* **Verification Steps**:
  * **Check Status**:
    ```bash
    # Using notarytool
    xcrun notarytool history \
      --apple-id "your@email.com" \
      --password "app-specific-password" \
      --team-id "YOUR_TEAM_ID"
    
    # Get detailed log
    xcrun notarytool log [submission-id] \
      --apple-id "your@email.com" \
      --password "app-specific-password" \
      --team-id "YOUR_TEAM_ID"
    ```

* **Stapling Process**:
  * **Purpose**:
    * Attaches notarization ticket to app
    * Enables offline verification
    * Improves user experience
  * **Command**:
    ```bash
    # Staple to .app
    xcrun stapler staple "YourApp.app"
    
    # Staple to .dmg
    xcrun stapler staple "YourApp.dmg"
    
    # Verify stapling
    xcrun stapler validate "YourApp.app"
    ```

* **Automation Integration**:
  * **CI/CD Setup**:
    * Secure credential management
    * Automated submission scripts
    * Status monitoring
  * **Build Pipeline**:
    * Post-build notarization
    * Automated stapling
    * Verification checks

* **Troubleshooting**:
  * **Common Issues**:
    * **Invalid Signatures**:
      * Missing or incorrect certificates
      * Hardened runtime not enabled
      * Invalid entitlements
    * **Submission Failures**:
      * Network connectivity issues
      * Invalid credentials
      * Malformed bundles
    * **Stapling Problems**:
      * File permission issues
      * Network access blocked
      * Invalid notarization

* **Best Practices**:
  * **Security**:
    * Use app-specific passwords
    * Secure credential storage
    * Regular certificate rotation
  * **Process**:
    * Implement automated workflows
    * Maintain detailed logging
    * Regular testing of notarized apps
  * **Maintenance**:
    * Monitor Apple requirements
    * Update tools regularly
    * Track submission history

* **Requirements Checklist**:
  * **Before Notarization**:
    * Valid Developer ID
    * Code signed with hardened runtime
    * Required entitlements included
    * No restricted APIs without entitlements
  * **After Notarization**:
    * Successful submission status
    * Stapling completed
    * Local validation passed
    * Gatekeeper verification

* **Performance Considerations**:
  * **Timing**:
    * Average processing time: 5-15 minutes
    * Submission size impacts duration
    * Network speed dependencies
  * **Resource Usage**:
    * Bandwidth requirements
    * Storage for archives
    * CPU usage during compression

## 5. macOS Keychain Management

* **Overview**:
  * **Definition**:
    * Secure system-level credential storage
    * Certificate and key management system
    * Core security infrastructure component
  * **Primary Functions**:
    * Stores digital certificates
    * Manages private keys
    * Handles passwords and secrets
    * Controls access permissions

* **Keychain Types**:
  * **Login Keychain**:
    * Created automatically for each user
    * Unlocked at login
    * Stores personal credentials
    * Default location for certificates
  * **System Keychain**:
    * System-wide credential storage
    * Requires admin privileges
    * Shared across all users
    * Used for system certificates
  * **Custom Keychains**:
    * Created for specific purposes
    * Isolated credential storage
    * Configurable access controls
    * Common in CI/CD systems

* **Command Line Operations**:
  * **Basic Commands**:
    ```bash
    # List keychains
    security list-keychains
    
    # Create new keychain
    security create-keychain -p "password" build.keychain
    
    # Add to search list
    security list-keychains -s login.keychain build.keychain
    
    # Unlock keychain
    security unlock-keychain -p "password" build.keychain
    ```
  
  * **Certificate Management**:
    ```bash
    # Import certificate
    security import certificate.p12 -k build.keychain -P "cert-password" -T /usr/bin/codesign
    
    # Set partition list
    security set-key-partition-list -S apple-tool:,apple: -s -k "password" build.keychain
    
    # Set keychain settings
    security set-keychain-settings -t 3600 -l build.keychain
    ```

* **Access Control**:
  * **Permission Levels**:
    * Read access
    * Write access
    * Delete access
    * Change permissions
  * **Application Access**:
    * Always allow
    * Confirm access
    * Deny access
  * **Timeout Settings**:
    * Lock after timeout
    * Lock on sleep
    * Lock when inactive

* **CI/CD Integration**:
  * **Setup Process**:
    * Create dedicated keychain
    * Import required certificates
    * Configure access permissions
    * Set unlock timeout
  * **Automation Requirements**:
    * Secure password storage
    * Automated unlocking
    * Proper cleanup
    * Error handling

* **Security Best Practices**:
  * **Certificate Management**:
    * Regular rotation
    * Secure backup
    * Access monitoring
    * Revocation planning
  * **Access Control**:
    * Minimal permissions
    * Regular audits
    * Strong passwords
    * Timeout enforcement
  * **Maintenance**:
    * Regular cleanup
    * Permission verification
    * Update monitoring
    * Backup strategy

* **Troubleshooting**:
  * **Common Issues**:
    * **Access Problems**:
      * Permission denied
      * Keychain locked
      * Missing certificates
    * **Integration Issues**:
      * CI/CD failures
      * Timeout problems
      * Permission conflicts
    * **Certificate Problems**:
      * Expired certificates
      * Trust issues
      * Import failures

* **Keychain Management Tools**:
  * **Built-in Tools**:
    * Keychain Access.app
    * security command-line tool
    * System Preferences
  * **Third-party Tools**:
    * Automation scripts
    * Management utilities
    * Monitoring tools

* **Backup and Recovery**:
  * **Backup Strategy**:
    * Regular exports
    * Secure storage
    * Version control
    * Recovery testing
  * **Recovery Procedures**:
    * Certificate restoration
    * Permission recovery
    * Access restoration
    * Emergency procedures

* **Performance Considerations**:
  * **Access Speed**:
    * Cache management
    * Search order
    * Unlock timing
  * **Resource Usage**:
    * Memory impact
    * Storage requirements
    * CPU utilization

## 6. Apple Developer Certificates

* **Overview**:
  * **Purpose**:
    * Establish developer identity
    * Enable secure code signing
    * Facilitate app distribution
  * **Types**:
    * Developer ID Application
    * Developer ID Installer
    * Mac App Store certificates
    * Development certificates

* **Developer ID Application Certificate**:
  * **Core Functions**:
    * Signs applications for distribution
    * Enables Gatekeeper validation
    * Supports notarization process
  * **Requirements**:
    * Apple Developer Program membership
    * Valid organization details
    * Two-factor authentication
  * **Validity Period**:
    * Valid for multiple years
    * Renewable through developer account
    * Revocation possible if compromised

* **Certificate Components**:
  * **Private Key**:
    * Generated locally
    * Must remain secure
    * Used for code signing
    * Stored in Keychain
  * **Public Certificate**:
    * Issued by Apple
    * Contains developer identity
    * Verifiable by macOS
    * Part of Apple's trust chain

* **Certificate Management**:
  * **Creation Process**:
    ```bash
    # Generate Certificate Signing Request (CSR)
    security create-certrequest-authority \
      -k ~/Desktop/private.key \
      -s "Your Company Name" \
      ~/Desktop/request.csr
    ```
  * **Installation**:
    ```bash
    # Import certificate
    security import DeveloperIDApplication.cer \
      -k ~/Library/Keychains/login.keychain-db \
      -T /usr/bin/codesign
    ```

* **Security Requirements**:
  * **Hardened Runtime**:
    * Required for notarization
    * Enforces security boundaries
    * Controls system access
  * **Entitlements**:
    * Camera access
    * Microphone access
    * Network access
    * File system access
    * Hardware access
    * Inter-process communication

* **Certificate Usage**:
  * **Code Signing**:
    ```bash
    # Sign with specific certificate
    codesign --sign "Developer ID Application: Your Name (TEAM_ID)" \
      --options runtime \
      --entitlements path/to/entitlements.plist \
      path/to/YourApp.app
    ```
  * **Verification**:
    ```bash
    # Verify certificate usage
    codesign --display --verbose=4 path/to/YourApp.app
    ```

* **Best Practices**:
  * **Private Key Security**:
    * Secure backup storage
    * Access control implementation
    * Regular rotation schedule
    * Compromise response plan
  * **Certificate Management**:
    * Monitor expiration dates
    * Maintain certificate inventory
    * Document renewal procedures
    * Regular validation checks

* **Troubleshooting**:
  * **Common Issues**:
    * **Certificate Problems**:
      * Expired certificates
      * Revoked certificates
      * Trust chain issues
      * Installation errors
    * **Signing Failures**:
      * Missing private keys
      * Invalid entitlements
      * Bundle format issues
      * Permission problems
    * **Validation Errors**:
      * Incomplete signing
      * Trust verification failures
      * Gatekeeper rejection
      * Notarization issues

* **Automation & CI/CD**:
  * **Certificate Installation**:
    * Secure certificate storage
    * Automated installation
    * Access management
    * Environment setup
  * **Build Process Integration**:
    * Automated signing
    * Certificate validation
    * Error handling
    * Logging and monitoring

* **Maintenance Tasks**:
  * **Regular Checks**:
    * Certificate validity
    * Private key security
    * Trust chain verification
    * Entitlements review
  * **Documentation**:
    * Certificate inventory
    * Renewal procedures
    * Emergency contacts
    * Recovery processes

* **Emergency Procedures**:
  * **Certificate Compromise**:
    * Immediate revocation
    * Apple notification
    * User communication
    * Recovery implementation
  * **Recovery Steps**:
    * Generate new certificate
    * Update build systems
    * Re-sign applications
    * Update distribution
