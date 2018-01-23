<?php

namespace App\Http\Middleware;

use Illuminate\Contracts\Encryption\DecryptException;
use Closure;
use Storage;
use Crypt;
use Carbon;

class AppRunner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        function GetMAC(){
            ob_start();
            system('getmac');
            $Content = ob_get_contents();
            ob_clean();
            return substr($Content, strpos($Content,'\\')-20, 17);
        }

            try {
                    // SET
                    $mcontents = "";

                    $decrypted = Crypt::decryptString($mcontents);

                    if(GetMAC() != $decrypted || !$decrypted)
                       return Response()->json(null, 406);

                if(Carbon::parse('2018-01-30 22:23:00.123456') <= Carbon::now() ){
                       return Response()->json(null, 406);
                }

            } catch (DecryptException $e) {
                //$mcontents = Storage::disk('local')->get('avatars/mavatar.txt');
                //$encryptString = Crypt::encryptString(GetMAC());
                // echo $encryptString ;
                //return Response()->json(null, 406);
            }

       return $next($request);
    }
}
