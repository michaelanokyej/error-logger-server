-- first remove any data that may be present
TRUNCATE errors;
TRUNCATE pollers;
TRUNCATE operators;


-- Insert some data into pollers table 
INSERT INTO
  pollers (poller_name, description)
VALUES
  (
    'RLI Submit', 'Request for Life Insurance Submits'
  ),
  (
    'ED', 'Policies are submitted for processing via email'
  ),
  (
    'EDI', 'Process & encrypts invoices from external companies'
  ),
  (
    'AutoIndexer', 'Indexes images to policies'
  ),
  (
    'XML', 'Loads application data to database'
  ),
  (
    'Hot Web', 'Agents view policy statuses via the web'
  ),
  (
    'CSWeb', 'Customer Service'
  ),
  (
    'Jet Image Merge', 'Ties policy data to a template - Banner'
  ),
  (
    'Auto Vend', 'Combines multiple images into single image - Banner'
  ),
  (
    'Auto Vend-WP', 'Ties policy data to a template - Wm Penn'
  ),
  (
    'Agent Image Merge', 'Ties agent data to a template'
  ),
  (
    'ETS', 'Moves emails / ETS poller now runs on MDOPSPC3 only'
  ),
  (
    'Task', 'Assigns tasks to appropriate queue'
  ),
  (
    'New Submit', 'AppAssist interviews & HiperScience data formatted for auto submission'
  ),
  (
    'PAC', 'Financial tasks with SLA'
  ),
  (
    'Duplicate Images', 'Processes duplicate images'
  ),
  (
    'AIS Print Manager', 'Generates Policy PDFs for AIS'
  ),
  (
    'Policy Print', 'Printing of policies'
  ),
  (
    'Banner Correspondence', 'Customer Letters'
  ),
  (
    'Select Quote/Quick Quote', 'Major client rep0resenting LGA lines of business'
  ),
  (
    'Web Interface', 'View of changes to existing policies'
  ),
  (
    'AppAssist', 'Provides oversight of policies from submission to issue'
  );

  INSERT INTO
   operators(first_name, last_name, username)
  VALUES
  (
    'michael', 'anokye', 'manokye'
  ),
  (
    'jermail', 'richardson', 'jrichardson'
  ),
  (
    'kyle', 'gadson', 'kgadson'
  );

  INSERT INTO
    errors(operator, error_description, poller_id)
  VALUES
  (
    1, 'RLI Submit keeps crashing with 404 error', 1
  ),
  (
    1, 'ED Poller keeps crashing with 404 error', 2
  ),
  (
    1, 'EDI Poller keeps crashing with 404 error', 3
  );