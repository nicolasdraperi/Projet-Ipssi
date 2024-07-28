<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController
{
    #[Route('/login', name: 'app_login')]
    public function login()
    {

    }
}
