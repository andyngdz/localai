## ADDED Requirements

### Requirement: Backend Process Termination

The system SHALL terminate the backend Python process and all its child processes when the application quits, using the `fkill` package for cross-platform support.

#### Scenario: Windows process tree termination

- **GIVEN** the backend is running on Windows
- **WHEN** the application quits
- **THEN** the system uses `fkill` with `tree: true` to terminate the entire process tree
- **AND** the terminal returns to the prompt within 5 seconds

#### Scenario: Unix/Linux/macOS process termination

- **GIVEN** the backend is running on Unix/Linux/macOS
- **WHEN** the application quits
- **THEN** the system uses `fkill` to send SIGTERM to the process
- **AND** falls back to SIGKILL after the timeout

### Requirement: Graceful Shutdown Timeout

The system SHALL wait for the backend process to exit gracefully before force-killing it.

#### Scenario: Process exits within timeout

- **GIVEN** the backend is running
- **WHEN** termination is requested
- **THEN** the system uses `fkill` with `forceAfterTimeout: 3000`
- **AND** if the process exits within 3 seconds, no force-kill occurs

#### Scenario: Process exceeds timeout

- **GIVEN** the backend is running and unresponsive
- **WHEN** termination is requested
- **AND** the process does not exit within 3 seconds
- **THEN** the system force-kills the process

### Requirement: Shutdown Error Handling

The system SHALL handle errors during backend shutdown gracefully without crashing the application.

#### Scenario: Process already terminated

- **GIVEN** the backend process has already exited
- **WHEN** stopBackend is called
- **THEN** `fkill` with `silent: true` handles the missing process gracefully
- **AND** no error is thrown

#### Scenario: Permission denied during kill

- **GIVEN** the system lacks permission to kill the process
- **WHEN** stopBackend is called
- **THEN** the error is logged
- **AND** the application continues to quit
