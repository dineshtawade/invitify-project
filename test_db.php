<?php
$tables = DB::select('SHOW TABLES');
foreach ($tables as $table) {
    $tableName = $table->Tables_in_invitify;
    $columns = Schema::getColumnListing($tableName);
    foreach ($columns as $column) {
        try {
            $res = DB::table($tableName)->where($column, 'like', '%Y4SGdjmDKTWmFIwwZdwPPHO96Z9JhgTV3yOJEfIs%')->first();
            if ($res) {
                echo "Found in $tableName.$column\n";
                print_r($res);
            }
        } catch (\Exception $e) {}
    }
}
