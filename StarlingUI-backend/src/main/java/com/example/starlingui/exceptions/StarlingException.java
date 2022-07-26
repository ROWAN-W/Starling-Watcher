package com.example.starlingui.exceptions;

public class StarlingException extends Exception{
    private static final long serialVersionUID = 9973L;

    String message;
    public StarlingException(String ErrorMessage){
        message=ErrorMessage;
    }

    public String getMessage(){
        return message;
    }
}
