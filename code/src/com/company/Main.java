package com.company;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("01", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher("01010111");
        int count=0;
            while (matcher.find()){count++;}

    }
}