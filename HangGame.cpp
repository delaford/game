#include<bits/stdc++.h>
using namespace std;
int check_for_occurance(char ch , string word , string &guess){
    int count = 0;
    for(int i = 0; i < word.size() ; i++){
        if(word[i] == ch){
            guess[i] = ch;
            ++count;
        }
    }
    return count;
}
void hint_provider(string &guess, string word){
    int i = 0;

    while(guess[i] != '*') i++;
    cout << "You could try out the character " << word[i] <<"\n";
}
int main(){
    vector<string> word_array{"programming","anagram","inhertiance","puzzle","encapsulation","java","template","mindgame","dynamic", "greedy", "abstraction"};
    int choice ;
    srand(time(NULL));
    int n = rand()%word_array.size();
    string word = word_array[n];
    n = word.size();
    string guess = string(n , '*');
    cout << guess<<"\n";
    int max_incorrect = min(24, max(3,n-2)) , incorrect_till_now = 0;
    cout <<"Lets start the guessing game\n";
    int pos[25]={0};
    char ch;
    while(incorrect_till_now < max_incorrect){
        cin >> ch;
        if(pos[ch-'a'] == 1){
            cout <<"I fear! You already have shot up all occurance for this character \n ";
            cout << "Please try another\n";
            continue;
        }
        if(check_for_occurance(ch, word , guess ) != 0){
            cout <<"Ah!  You unlocked some characters\n";
            cout << "Go on now.... ";
        }else{
            cout <<"This character isnt present\n";
            incorrect_till_now+=1;
             if((incorrect_till_now + 1) == max_incorrect){
                cout <<"Here`s a hint for you \n";
                cout <<"Do you want to access it (Y | N ) ?\t";
                char c; cin >> c;
                if(c == 'Y') 
                hint_provider(guess , word);
            }
            if(max_incorrect == incorrect_till_now){
                cout <<"Sorry you are out of tries \n";
                cout <<"Give the game another try \n";
                cout <<"Have a nice day\n";
                break;
            }
            cout << "Please try another character\n";
            cout << "You are left with "<< max_incorrect-incorrect_till_now<<" tries\n";
        }
        cout << guess <<"\n";
        if(guess == word){
            cout <<"You won\n";
            break;
        }
        pos[ch-'a']  = 1;
    }
    cin.ignore();
    cin.get();
    return 0;
}
