-- first remove any data that may be present
TRUNCATE errors;
TRUNCATE operations;
TRUNCATE operators;


-- Insert some data into pollers table 
INSERT INTO
  operations (operation_name, description, category)
VALUES
  (
    'RLI Submit', 'Request for Life Insurance Submits', 'poller'
  ),
  (
    'ED', 'Policies are submitted for processing via email', 'poller'
  ),
  (
    'EDI', 'Process & encrypts invoices from external companies', 'poller'
  ),
  (
    'AutoIndexer', 'Indexes images to policies', 'poller'
  ),
  (
    'XML', 'Loads application data to database', 'poller'
  ),
  (
    'Hot Web', 'Agents view policy statuses via the web', 'poller'
  ),
  (
    'CSWeb', 'Customer Service', 'poller'
  ),
  (
    'Jet Image Merge', 'Ties policy data to a template - Banner', 'poller'
  ),
  (
    'Auto Vend', 'Combines multiple images into single image - Banner', 'poller'
  ),
  (
    'Auto Vend-WP', 'Ties policy data to a template - Wm Penn', 'poller'
  ),
  (
    'Agent Image Merge', 'Ties agent data to a template', 'poller'
  ),
  (
    'ETS', 'Moves emails / ETS poller now runs on MDOPSPC3 only', 'poller'
  ),
  (
    'Task', 'Assigns tasks to appropriate queue', 'poller'
  ),
  (
    'New Submit', 'AppAssist interviews & HiperScience data formatted for auto submission', 'poller'
  ),
  (
    'PAC', 'Financial tasks with SLA', 'task'
  ),
  (
    'Duplicate Images', 'Processes duplicate images', 'poller'
  ),
  (
    'AIS Print Manager', 'Generates Policy PDFs for AIS', 'poller'
  ),
  (
    'Policy Print', 'Printing of policies', 'poller'
  ),
  (
    'Banner Correspondence', 'Customer Letters', 'task'
  ),
  (
    'Select Quote/Quick Quote', 'Major client rep0resenting LGA lines of business', 'poller'
  ),
  (
    'Web Interface', 'View of changes to existing policies', 'poller'
  ),
  (
    'GetBanWeb', 'Gets all web payments for banner', 'task'
  ),
  (
    'GetPenWeb', 'Gets all web payments for Penn', 'task'
  ),
  (
    'AppAssist', 'Provides oversight of policies from submission to issue', 'poller'
  );

  INSERT INTO
   operators(first_name, last_name, username)
  VALUES
  (
    'michael', 'anokye', 'manokye'
  ),
  (
    'jermail', 'richardson', 'jrichardson'
  );

  INSERT INTO
    errors(operator_id, error_description, operation_id)
  VALUES
  (
    1, 'RLI Submit keeps crashing with 404 error', 1
  ),
  (
    1, 'ED Poller keeps crashing with 404 error', 2
  ),
  (
    2, 'GetBanWeb crashed', 22
  ),
  (
    2, 'GetPennWeb crashed', 23
  ),
  (
    2, 'Banner correspondence crashes whenever attempted', 19
  ),
  (
    2, 'ETS Poller keeps crashing with 404 error', 12
  ),
  (
    1, 'EDI Poller keeps crashing with 404 error', 3
  );