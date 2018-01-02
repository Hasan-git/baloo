<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $this->call(RoleTableSeeder::class);
      $this->call(UsersTableSeeder::class);
      $this->call(ClientsTableSeeder::class);
      // $this->call(ProjectSeeder::class);
      // $this->call(CustomerClientTableSeeder::class);
      // $this->call(RentsTableSeeder::class);
      // $this->call(RepairTableSeeder::class);
      // $this->call(SpendingsTableSeeder::class);
      //$this->call(PermissionTableSeeder::class);
    }
}
