<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $table = 'hero';
    public $timestamps = false;
    protected $guarded = [];

    public function Role(){
        return $this->belongsTo(Role::class,'id_role');
    }
}
