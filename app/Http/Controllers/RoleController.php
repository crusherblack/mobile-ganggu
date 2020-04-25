<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;

class RoleController extends Controller
{
    public function index()
    {
        $role = Role::orderBy('name','desc')->get();
        return view('role.index',compact('role'));
    }      
   
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
        ]);

        Role::updateOrCreate(['id' => $request->id],
            $validatedData
        );

        return redirect()->back()->with('message','Data Berhasil disimpan');
    }   
 
    public function edit($id)
    {    
        $role = Role::find($id);
        return response()->json($role);
    }   

    public function destroy($id)
    {
        Role::destroy($id);
        return redirect()->back()->with('delete','Data Berhasil dihapus');
    }
}
