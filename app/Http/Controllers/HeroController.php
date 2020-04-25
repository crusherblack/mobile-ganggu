<?php

namespace App\Http\Controllers;

use App\Hero;
use App\Role;
use Illuminate\Http\Request;

class HeroController extends Controller
{

    public function home(){
        $hero = Hero::with('role')->orderBy('name','desc')->paginate(8);
        return view('home',compact('hero'));
    }
    
    public function index()
    {
        $role = Role::all();
        $hero = Hero::with('role')->orderBy('name','asc')->get();
        return view('hero.index',compact('hero','role'));
    }      
   
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:20',
            'id_role' => 'required',            
            'deskripsi' => 'required',
        ]);

        $id = $request->id;

        if($id){
            $hero_id = Hero::find($id);
            if($request->has('image')){
                $gambar = $request->image;
                $new_gambar = time().$gambar->getClientOriginalName();
                $gambar->move('public/uploads/images/', $new_gambar);

                $hero = [
                    'name' => $request->name,
                    'id_role' => $request->id_role,
                    'image' => 'public/uploads/images/'.$new_gambar,
                    'deskripsi' => $request->deskripsi,
                ];
            }
            else{
                $hero = [
                    'name' => $request->name,
                    'id_role' => $request->id_role,                    
                    'deskripsi' => $request->deskripsi,
                ];
            }
            $hero_id->update($hero);

        }else{
            $gambar = $request->image;
            $new_gambar = time().$gambar->getClientOriginalName();

            Hero::create([
                'name' => $request->name,
                'id_role' => $request->id_role,
                'image' => 'public/uploads/images/'.$new_gambar,
                'deskripsi' => $request->deskripsi,
            ]);

            $gambar->move('public/uploads/images/', $new_gambar);
        }       
        
        return redirect()->back()->with('message','Data Berhasil disimpan');
    }   
 
    public function edit($id)
    {    
        $hero = Hero::find($id);
        return response()->json($hero);
    }   

    public function destroy($id)
    {
        Hero::destroy($id);
        return redirect()->back()->with('delete','Data Berhasil dihapus');
    }

    public function details($id){
        $hero = Hero::find($id);
        return view('hero.details', compact('hero'));
    }


}
